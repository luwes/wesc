use std::cell::RefCell;
use std::collections::HashMap;
use std::fs;
use std::io::{self};
use std::rc::Rc;
use std::sync::Arc;

/// A read-only provider of input bytes, keyed by path.
///
/// The expansion engine never writes and only ever reads inputs by path (every
/// read funnels through [`read_file_cached`]). Abstracting that behind a trait
/// lets a build draw its inputs from somewhere other than the local filesystem
/// — e.g. an in-memory map — which is what a no-filesystem target like a
/// WebAssembly worker needs. The default is [`OsSource`], so native builds keep
/// reading from disk unchanged.
pub trait Source {
    /// Read the full contents of `path`.
    fn read(&self, path: &str) -> io::Result<Vec<u8>>;
}

/// The default [`Source`]: reads from the local filesystem with [`std::fs`].
#[derive(Debug, Default, Clone, Copy)]
pub struct OsSource;

impl Source for OsSource {
    fn read(&self, path: &str) -> io::Result<Vec<u8>> {
        fs::read(path)
    }
}

// Per-build, per-thread cache of file contents. Each build runs on its own
// thread (synchronous builds on the caller's thread, streaming builds on a
// freshly spawned one), so thread-local storage isolates concurrent builds
// from one another without any locking. [`clear_file_cache`] resets the cache
// at the start of each build so a reused worker thread never serves stale
// bytes from a previous build.
thread_local! {
    static FILE_CACHE: RefCell<HashMap<String, Arc<Vec<u8>>>> = RefCell::new(HashMap::new());

    // The active input source for this thread. Defaults to the filesystem; a
    // caller can swap in another source (e.g. an in-memory map) for the builds
    // that run on this thread. `Rc<dyn Source>` is fine because the cache and
    // the source are only ever touched from the owning thread.
    static SOURCE: RefCell<Rc<dyn Source>> = RefCell::new(Rc::new(OsSource));
}

/// Use `source` for subsequent reads on the current thread (until reset). The
/// byte cache is independent, so callers typically also call
/// [`clear_file_cache`] when switching inputs.
pub fn set_source(source: Rc<dyn Source>) {
    SOURCE.with(|current| *current.borrow_mut() = source);
}

/// Restore the default [`OsSource`] for the current thread.
pub fn reset_source() {
    SOURCE.with(|current| *current.borrow_mut() = Rc::new(OsSource));
}

#[derive(Debug)]
pub struct ChunkReader {
    bytes: Arc<Vec<u8>>,
    position: usize,
    chunk_size: usize,
}

impl ChunkReader {
    pub fn new(filepath: &str, chunk_size: usize) -> io::Result<Self> {
        let bytes = read_file_cached(filepath)?;
        Ok(ChunkReader {
            bytes,
            position: 0,
            chunk_size,
        })
    }

    pub fn read_next_chunk(&mut self) -> io::Result<Option<Vec<u8>>> {
        if self.position >= self.bytes.len() {
            return Ok(None); // No more data to read
        }

        let end = (self.position + self.chunk_size).min(self.bytes.len());
        let chunk = self.bytes[self.position..end].to_vec();
        self.position = end;
        Ok(Some(chunk))
    }

    pub fn position(&mut self) -> io::Result<u64> {
        Ok(self.position as u64)
    }

    pub fn seek(&mut self, position: u64) -> io::Result<()> {
        self.position = position as usize;
        Ok(())
    }
}

pub fn clear_file_cache() {
    FILE_CACHE.with(|cache| cache.borrow_mut().clear());
}

pub fn read_file_cached(filepath: &str) -> io::Result<Arc<Vec<u8>>> {
    if let Some(bytes) = FILE_CACHE.with(|cache| cache.borrow().get(filepath).cloned()) {
        return Ok(bytes);
    }

    let bytes = Arc::new(SOURCE.with(|source| source.borrow().read(filepath))?);
    FILE_CACHE.with(|cache| {
        cache
            .borrow_mut()
            .insert(filepath.to_string(), bytes.clone());
    });
    Ok(bytes)
}

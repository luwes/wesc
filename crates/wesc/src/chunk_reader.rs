use std::cell::RefCell;
use std::collections::HashMap;
use std::fs;
use std::io::{self};
use std::path::{Component, Path, PathBuf};
use std::sync::Arc;

/// A read-only provider of input bytes, keyed by path.
///
/// The expansion engine never writes and only ever reads inputs by path (every
/// read funnels through [`read_file_cached`]). Abstracting that behind a trait
/// lets a build draw its inputs from somewhere other than the local filesystem,
/// which is what a no-filesystem target like a WebAssembly worker needs. The
/// default is [`OsSource`], so builds keep reading from disk unchanged; the
/// `source` build option installs a [`MemorySource`] for the build instead.
///
/// `Source` is `Send + Sync` so a single source can also be shared with the
/// background CSS/JS extractor threads a native build spawns.
pub(crate) trait Source: Send + Sync {
    /// Read the full contents of `path`.
    fn read(&self, path: &str) -> io::Result<Vec<u8>>;
}

/// The default [`Source`]: reads from the local filesystem with [`std::fs`].
#[derive(Debug, Default, Clone, Copy)]
pub(crate) struct OsSource;

impl Source for OsSource {
    fn read(&self, path: &str) -> io::Result<Vec<u8>> {
        fs::read(path)
    }
}

/// An in-memory [`Source`] backing the `source` build option: a `path ->
/// contents` map (keys **lexically normalized**, so a file resolved through
/// `.`/`..` segments still matches the key it was stored under).
///
/// A read for a path that isn't in the map falls back to the filesystem, so an
/// entry can be supplied from memory while its component files are read from
/// disk (or vice versa). Supply every referenced file to run a build that never
/// touches the filesystem at all (e.g. on a WebAssembly worker).
#[derive(Debug, Default, Clone)]
pub(crate) struct MemorySource {
    files: HashMap<String, Vec<u8>>,
}

impl MemorySource {
    /// Build from the `source` build-option map, normalizing every key.
    pub(crate) fn from_map(files: &HashMap<String, Vec<u8>>) -> Self {
        Self {
            files: files
                .iter()
                .map(|(path, contents)| (normalize_key(path), contents.clone()))
                .collect(),
        }
    }
}

impl Source for MemorySource {
    fn read(&self, path: &str) -> io::Result<Vec<u8>> {
        match self.files.get(&normalize_key(path)) {
            Some(bytes) => Ok(bytes.clone()),
            None => OsSource.read(path),
        }
    }
}

/// Collapse `.` and `..` segments in `path` lexically (without touching the
/// filesystem), so logically-equal paths map to the same key.
pub(crate) fn normalize_key(path: &str) -> String {
    let mut out = PathBuf::new();
    for component in Path::new(path).components() {
        match component {
            Component::CurDir => {}
            Component::ParentDir => {
                out.pop();
            }
            other => out.push(other.as_os_str()),
        }
    }
    out.to_string_lossy().into_owned()
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
    // that run on this thread. Stored behind `Arc` so the same source can be
    // cloned onto the background CSS/JS extractor threads a native build spawns.
    static SOURCE: RefCell<Arc<dyn Source>> = RefCell::new(Arc::new(OsSource));
}

/// The input source currently active on this thread.
pub(crate) fn current_source() -> Arc<dyn Source> {
    SOURCE.with(|current| current.borrow().clone())
}

/// Make `source` the active input source on the current thread until the
/// returned guard drops, which restores whatever source was active before.
/// Nestable, so a build can layer one source over an already-installed one (and
/// re-install the build's source on each extractor thread).
pub(crate) fn use_source(source: Arc<dyn Source>) -> SourceGuard {
    let previous = SOURCE.with(|current| current.replace(source));
    SourceGuard {
        previous: Some(previous),
    }
}

/// Restores the previously active source on drop. See [`use_source`].
pub(crate) struct SourceGuard {
    previous: Option<Arc<dyn Source>>,
}

impl Drop for SourceGuard {
    fn drop(&mut self) {
        if let Some(previous) = self.previous.take() {
            SOURCE.with(|current| *current.borrow_mut() = previous);
        }
    }
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

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn normalize_collapses_dot_segments() {
        assert_eq!(normalize_key("/a/b/../c.html"), "/a/c.html");
        assert_eq!(normalize_key("/a/./b/c.html"), "/a/b/c.html");
        assert_eq!(normalize_key("a/b/../../c.html"), "c.html");
    }

    #[test]
    fn memory_source_serves_files_regardless_of_dot_segments() {
        // A stored file is served even when looked up via a `..` form; paths
        // not in the map fall back to the filesystem (and miss here).
        let source = MemorySource::from_map(&HashMap::from([(
            "/web/pages/index.html".to_string(),
            b"<html></html>".to_vec(),
        )]));
        assert_eq!(
            source.read("/web/extra/../pages/index.html").unwrap(),
            b"<html></html>"
        );
        assert!(source.read("/web/pages/other.html").is_err());
    }
}

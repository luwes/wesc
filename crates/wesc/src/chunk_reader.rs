use std::cell::RefCell;
use std::collections::HashMap;
use std::fs;
use std::io::{self};
use std::path::{Component, Path, PathBuf};
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

/// An in-memory [`Source`] backed by a `path -> bytes` map, for builds with no
/// filesystem (e.g. a WebAssembly worker).
///
/// Keys are **lexically normalized** (`.`/`..` segments collapsed) on both
/// insert and lookup. The engine resolves component `href`s relative to the
/// declaring file without collapsing `..` (so it asks for paths like
/// `web/pages/../components/card.html`); normalizing both ends makes those
/// lookups hit the entry the caller stored as `web/components/card.html`.
#[derive(Debug, Default, Clone)]
pub struct MemorySource {
    files: HashMap<String, Arc<Vec<u8>>>,
}

impl MemorySource {
    /// Create an empty source.
    pub fn new() -> Self {
        Self::default()
    }

    /// Add (or replace) a file's contents at `path`.
    pub fn insert(&mut self, path: impl AsRef<str>, contents: impl Into<Vec<u8>>) {
        self.files
            .insert(normalize_key(path.as_ref()), Arc::new(contents.into()));
    }

    /// Builder-style [`insert`](Self::insert).
    #[must_use]
    pub fn with(mut self, path: impl AsRef<str>, contents: impl Into<Vec<u8>>) -> Self {
        self.insert(path, contents);
        self
    }
}

impl Source for MemorySource {
    fn read(&self, path: &str) -> io::Result<Vec<u8>> {
        self.files
            .get(&normalize_key(path))
            .map(|bytes| bytes.as_ref().clone())
            .ok_or_else(|| {
                io::Error::new(
                    io::ErrorKind::NotFound,
                    format!("path not found in memory source: {path}"),
                )
            })
    }
}

/// Collapse `.` and `..` segments in `path` lexically (without touching the
/// filesystem), so logically-equal paths map to the same key.
fn normalize_key(path: &str) -> String {
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
    // that run on this thread. `Rc<dyn Source>` is fine because the cache and
    // the source are only ever touched from the owning thread.
    static SOURCE: RefCell<Rc<dyn Source>> = RefCell::new(Rc::new(OsSource));
}

/// Make `source` the active input source on the current thread until the
/// returned guard drops, which restores the default [`OsSource`].
///
/// Internal plumbing: the public entry point is
/// [`build_with_source`](crate::build_with_source).
pub(crate) fn use_source(source: Rc<dyn Source>) -> SourceGuard {
    SOURCE.with(|current| *current.borrow_mut() = source);
    SourceGuard
}

/// Restores the default [`OsSource`] on drop. See [`use_source`].
pub(crate) struct SourceGuard;

impl Drop for SourceGuard {
    fn drop(&mut self) {
        SOURCE.with(|current| *current.borrow_mut() = Rc::new(OsSource));
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
    fn memory_source_matches_unnormalized_lookups() {
        // The caller stores a clean key; the engine looks it up with the
        // `..` form `resolve_href` produces.
        let source = MemorySource::new().with("/web/components/card.html", "hi");
        assert_eq!(
            source.read("/web/pages/../components/card.html").unwrap(),
            b"hi"
        );
        assert!(source.read("/web/missing.html").is_err());
    }
}

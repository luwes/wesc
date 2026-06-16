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
/// lets a build draw its entry from somewhere other than the local filesystem
/// (the `code` build option), which is what a no-filesystem target like a
/// WebAssembly worker needs. The default is [`OsSource`], so builds keep reading
/// from disk unchanged.
pub(crate) trait Source {
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

/// A [`Source`] that serves one entry's bytes from an in-memory string (the
/// `code` build option) and falls back to the filesystem for everything else
/// (e.g. the component files the entry references).
///
/// The entry key is **lexically normalized** (`.`/`..` collapsed) so the
/// build's resolved entry path matches regardless of `.`/`..` segments.
pub(crate) struct CodeSource {
    entry: String,
    code: Vec<u8>,
}

impl CodeSource {
    pub(crate) fn new(entry_path: impl AsRef<str>, code: Vec<u8>) -> Self {
        Self {
            entry: normalize_key(entry_path.as_ref()),
            code,
        }
    }
}

impl Source for CodeSource {
    fn read(&self, path: &str) -> io::Result<Vec<u8>> {
        if normalize_key(path) == self.entry {
            Ok(self.code.clone())
        } else {
            OsSource.read(path)
        }
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
/// returned guard drops, which restores the default [`OsSource`]. Used to serve
/// the entry from the `code` build option.
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
    fn code_source_serves_entry_regardless_of_dot_segments() {
        // The entry is served from `code` even when looked up via a `..` form;
        // other paths fall back to the filesystem (and miss here).
        let source = CodeSource::new("/web/pages/index.html", b"<html></html>".to_vec());
        assert_eq!(
            source.read("/web/extra/../pages/index.html").unwrap(),
            b"<html></html>"
        );
        assert!(source.read("/web/pages/other.html").is_err());
    }
}

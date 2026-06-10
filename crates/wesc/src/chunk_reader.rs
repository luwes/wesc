use std::cell::RefCell;
use std::collections::HashMap;
use std::fs;
use std::io::{self};
use std::sync::Arc;

// Per-build, per-thread cache of file contents. Each build runs on its own
// thread (synchronous builds on the caller's thread, streaming builds on a
// freshly spawned one), so thread-local storage isolates concurrent builds
// from one another without any locking. [`clear_file_cache`] resets the cache
// at the start of each build so a reused worker thread never serves stale
// bytes from a previous build.
thread_local! {
    static FILE_CACHE: RefCell<HashMap<String, Arc<Vec<u8>>>> = RefCell::new(HashMap::new());
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

    let bytes = Arc::new(fs::read(filepath)?);
    FILE_CACHE.with(|cache| {
        cache
            .borrow_mut()
            .insert(filepath.to_string(), bytes.clone());
    });
    Ok(bytes)
}

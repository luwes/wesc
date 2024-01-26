use std::fs::File;
use std::io::{self, Read, Seek, SeekFrom};

#[derive(Debug)]
pub struct ChunkReader {
    file: File,
    chunk_size: usize,
}

impl ChunkReader {
    // Create a new ChunkReader
    pub fn new(filepath: &str, chunk_size: usize) -> io::Result<Self> {
        let file = File::open(filepath)?;
        Ok(ChunkReader { file, chunk_size })
    }

    // Read the next chunk
    pub fn read_next_chunk(&mut self) -> io::Result<Option<Vec<u8>>> {
        let mut buffer = vec![0; self.chunk_size];
        let bytes_read = self.file.read(&mut buffer)?;

        if bytes_read == 0 {
            return Ok(None); // No more data to read
        }

        buffer.truncate(bytes_read);
        Ok(Some(buffer))
    }

    pub fn position(&mut self) -> io::Result<u64> {
        Ok(self.file.stream_position()?)
    }

    // seek to a position
    pub fn seek(&mut self, position: u64) -> io::Result<()> {
        self.file.seek(SeekFrom::Start(position))?;
        Ok(())
    }
}

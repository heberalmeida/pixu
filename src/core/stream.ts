import type { StreamCompressionOptions, CompressionResult } from '../types';
import { PixuCompressor } from './compressor';

export async function* compressStream(
  files: AsyncIterable<File | Blob> | Iterable<File | Blob>,
  options: StreamCompressionOptions = {}
): AsyncGenerator<CompressionResult, void, unknown> {
  const compressor = new PixuCompressor();

  for await (const file of files) {
    const result = await compressor.compress(file, options);
    yield result;

    if (options.onChunk) {
      const chunk = result.file instanceof File 
        ? new Blob([result.file]) 
        : result.file;
      options.onChunk(chunk, 0);
    }
  }
}


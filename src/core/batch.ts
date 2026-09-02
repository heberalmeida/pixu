import type { BatchCompressionOptions, CompressionResult } from '../types';
import { PixuCompressor } from './compressor';

export async function compressBatch(
  files: (File | Blob)[],
  options: BatchCompressionOptions = {}
): Promise<CompressionResult[]> {
  const concurrency = options.concurrency || 3;
  const results: CompressionResult[] = [];
  const errors: Error[] = [];

  const compressor = new PixuCompressor();

  async function processFile(file: File | Blob, index: number): Promise<void> {
    try {
      const result = await compressor.compress(file, options);
      results[index] = result;
      if (options.onItemComplete) {
        options.onItemComplete(result, index);
      }
    } catch (error) {
      const err = error instanceof Error ? error : new Error('Unknown error');
      errors[index] = err;
      if (options.onItemError) {
        options.onItemError(err, index);
      }
    }
  }

  const chunks: (File | Blob)[][] = [];
  for (let i = 0; i < files.length; i += concurrency) {
    chunks.push(files.slice(i, i + concurrency));
  }

  for (const chunk of chunks) {
    await Promise.all(
      chunk.map((file, chunkIndex) => {
        const globalIndex = chunks.indexOf(chunk) * concurrency + chunkIndex;
        return processFile(file, globalIndex);
      })
    );
  }

  if (errors.length > 0 && !options.onItemError) {
    throw new Error(`Batch compression failed for ${errors.length} file(s)`);
  }

  return results;
}


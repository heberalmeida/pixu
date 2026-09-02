import type { BatchCompressionOptions, CompressionResult } from '../types';
import { PixuCompressor } from './compressor';

export interface AdvancedBatchOptions extends Omit<BatchCompressionOptions, 'onProgress'> {
  retryAttempts?: number;
  retryDelay?: number;
  priority?: 'fifo' | 'lifo' | 'size-asc' | 'size-desc';
  onProgress?: (completed: number, total: number, errors: number) => void;
  pause?: () => boolean; // Function that returns true to pause
  resume?: () => boolean; // Function that returns true to resume
}

export interface BatchProgress {
  completed: number;
  total: number;
  errors: number;
  inProgress: number;
  queued: number;
  estimatedTimeRemaining?: number; // milliseconds
}

export class AdvancedBatchProcessor {
  private compressor: PixuCompressor;
  private paused = false;
  private cancelled = false;
  private startTime: number = 0;
  private completedCount = 0;
  private errorCount = 0;

  constructor() {
    this.compressor = new PixuCompressor();
  }

  async processBatch(
    files: (File | Blob)[],
    options: AdvancedBatchOptions = {}
  ): Promise<CompressionResult[]> {
    this.startTime = Date.now();
    this.completedCount = 0;
    this.errorCount = 0;
    this.paused = false;
    this.cancelled = false;

    const {
      concurrency = 3,
      retryAttempts = 2,
      retryDelay = 1000,
      priority = 'fifo',
      onProgress,
      onItemComplete,
      onItemError,
    } = options;

    // Sort files by priority
    const sortedFiles = this.sortByPriority(files, priority);

    const results: CompressionResult[] = new Array(files.length);
    const errors: Error[] = [];
    const fileMap = new Map<File | Blob, number>();
    sortedFiles.forEach((file, index) => {
      fileMap.set(file, files.indexOf(file));
    });

    const processFile = async (
      file: File | Blob,
      originalIndex: number
    ): Promise<void> => {
      if (this.cancelled) {
        return;
      }

      // Wait if paused
      while (this.paused && !this.cancelled) {
        await new Promise(resolve => setTimeout(resolve, 100));
      }

      if (this.cancelled) {
        return;
      }

      let lastError: Error | null = null;
      
      for (let attempt = 0; attempt <= retryAttempts; attempt++) {
        try {
          const {
            retryAttempts: _retryAttempts,
            retryDelay: _retryDelay,
            priority: _priority,
            onProgress: _onProgress,
            pause: _pause,
            resume: _resume,
            onItemComplete: _onItemComplete,
            onItemError: _onItemError,
            concurrency: _concurrency,
            ...compressOptions
          } = options;
          const result = await this.compressor.compress(file, compressOptions);
          results[originalIndex] = result;
          this.completedCount++;
          
          if (onItemComplete) {
            onItemComplete(result, originalIndex);
          }
          
          if (onProgress) {
            onProgress(
              this.completedCount,
              files.length,
              this.errorCount
            );
          }
          
          return;
        } catch (error) {
          lastError = error instanceof Error ? error : new Error('Unknown error');
          
          if (attempt < retryAttempts) {
            await new Promise(resolve => setTimeout(resolve, retryDelay));
          }
        }
      }

      // All retries failed
      this.errorCount++;
      errors[originalIndex] = lastError!;
      
      if (onItemError) {
        onItemError(lastError!, originalIndex);
      }
      
      if (onProgress) {
        onProgress(
          this.completedCount,
          files.length,
          this.errorCount
        );
      }
    };

    // Process in chunks with concurrency control
    const chunks: (File | Blob)[][] = [];
    for (let i = 0; i < sortedFiles.length; i += concurrency) {
      chunks.push(sortedFiles.slice(i, i + concurrency));
    }

    for (const chunk of chunks) {
      if (this.cancelled) {
        break;
      }

      await Promise.all(
        chunk.map((file) => {
          const originalIndex = fileMap.get(file)!;
          return processFile(file, originalIndex);
        })
      );
    }

    if (errors.length > 0 && !onItemError) {
      throw new Error(`Batch compression failed for ${errors.length} file(s)`);
    }

    return results;
  }

  pause(): void {
    this.paused = true;
  }

  resume(): void {
    this.paused = false;
  }

  cancel(): void {
    this.cancelled = true;
    this.compressor.abort();
  }

  getProgress(): BatchProgress {
    const elapsed = Date.now() - this.startTime;
    const rate = this.completedCount / (elapsed / 1000); // files per second
    const remaining = this.completedCount > 0 
      ? Math.ceil((this.completedCount - this.completedCount) / rate * 1000)
      : undefined;

    return {
      completed: this.completedCount,
      total: 0, // Would need to be passed
      errors: this.errorCount,
      inProgress: 0, // Would need to track
      queued: 0, // Would need to track
      estimatedTimeRemaining: remaining,
    };
  }

  private sortByPriority(
    files: (File | Blob)[],
    priority: 'fifo' | 'lifo' | 'size-asc' | 'size-desc'
  ): (File | Blob)[] {
    const sorted = [...files];

    switch (priority) {
      case 'lifo':
        return sorted.reverse();
      case 'size-asc':
        return sorted.sort((a, b) => a.size - b.size);
      case 'size-desc':
        return sorted.sort((a, b) => b.size - a.size);
      case 'fifo':
      default:
        return sorted;
    }
  }
}


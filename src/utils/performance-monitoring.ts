export interface CompressionMetrics {
  startTime: number;
  endTime?: number;
  duration?: number; // milliseconds
  originalSize: number;
  compressedSize: number;
  compressionRatio: number;
  throughput?: number; // bytes per second
  memoryUsed?: number;
  memoryPeak?: number;
}

export class PerformanceMonitor {
  private metrics: CompressionMetrics;
  private startMemory: number;

  constructor(originalSize: number) {
    this.metrics = {
      startTime: performance.now(),
      originalSize,
      compressedSize: 0,
      compressionRatio: 0,
    };
    this.startMemory = this.getCurrentMemory();
  }

  recordCompression(compressedSize: number): CompressionMetrics {
    const endTime = performance.now();
    const duration = endTime - this.metrics.startTime;
    const compressionRatio = 1 - compressedSize / this.metrics.originalSize;
    const throughput = this.metrics.originalSize / (duration / 1000);
    const currentMemory = this.getCurrentMemory();
    const memoryUsed = currentMemory - this.startMemory;

    this.metrics = {
      ...this.metrics,
      endTime,
      duration,
      compressedSize,
      compressionRatio,
      throughput,
      memoryUsed,
      memoryPeak: currentMemory,
    };

    return this.metrics;
  }

  getMetrics(): CompressionMetrics {
    return { ...this.metrics };
  }

  private getCurrentMemory(): number {
    if ('memory' in performance) {
      return (performance as any).memory.usedJSHeapSize;
    }
    return 0;
  }
}

export function formatBytes(bytes: number): string {
  if (!Number.isFinite(bytes) || bytes === 0) return '0 B';
  const sign = bytes < 0 ? '-' : '';
  const abs = Math.abs(bytes);
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.min(sizes.length - 1, Math.floor(Math.log(abs) / Math.log(k)));
  return `${sign}${Math.round((abs / Math.pow(k, i)) * 100) / 100} ${sizes[i]}`;
}

export function formatDuration(ms: number): string {
  if (ms < 1000) return `${Math.round(ms)}ms`;
  if (ms < 60000) return `${(ms / 1000).toFixed(2)}s`;
  return `${(ms / 60000).toFixed(2)}min`;
}


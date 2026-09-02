export interface MemoryInfo {
  used: number; // bytes
  available: number; // bytes (estimated)
  limit: number; // bytes (estimated safe limit)
}

export function getMemoryInfo(): MemoryInfo {
  // Browser memory API (if available)
  if ('memory' in performance) {
    const mem = (performance as any).memory;
    return {
      used: mem.usedJSHeapSize,
      available: mem.totalJSHeapSize - mem.usedJSHeapSize,
      limit: mem.jsHeapSizeLimit,
    };
  }

  // Fallback estimation
  return {
    used: 0,
    available: 100 * 1024 * 1024, // Assume 100MB available
    limit: 500 * 1024 * 1024, // Assume 500MB limit
  };
}

export function shouldUseStreaming(fileSize: number): boolean {
  // Use streaming for files larger than 10MB
  return fileSize > 10 * 1024 * 1024;
}

export function calculateChunkSize(fileSize: number, availableMemory?: number): number {
  const mem = availableMemory || getMemoryInfo().available;
  // Use 10% of available memory or 5MB, whichever is smaller
  const chunkSize = Math.min(mem * 0.1, 5 * 1024 * 1024);
  // Ensure chunk is at least 1MB
  return Math.max(chunkSize, 1024 * 1024);
}

export function cleanupCanvas(canvas: HTMLCanvasElement): void {
  const ctx = canvas.getContext('2d');
  if (ctx) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  }
  canvas.width = 0;
  canvas.height = 0;
}

export function cleanupImage(img: HTMLImageElement): void {
  if (img.src && img.src.startsWith('blob:')) {
    URL.revokeObjectURL(img.src);
  }
  img.src = '';
  img.onload = null;
  img.onerror = null;
}


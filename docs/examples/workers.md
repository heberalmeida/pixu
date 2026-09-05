# Web Worker Examples

Examples using Web Workers for non-blocking compression.

## Basic Worker Usage

<CompressionDemo :options="{ quality: 0.8 }" />

```typescript
import { createWorker } from 'pixu/worker/client';

async function compressInWorker(file: File) {
  const worker = await createWorker();

  try {
    const result = await worker.compress(file, {
      quality: 0.8,
    });

    console.log('Compressed in worker:', result.compressedSize, 'bytes');
    return result;
  } finally {
    worker.terminate();
  }
}
```

## Worker with All Options

```typescript
import { createWorker } from 'pixu/worker/client';

async function compressWithAllOptions(file: File) {
  const worker = await createWorker();

  try {
    const result = await worker.compress(file, {
      quality: 0.8,
      maxWidth: 1920,
      maxHeight: 1080,
      minWidth: 320,
      minHeight: 240,
      resize: 'contain',
      format: 'image/webp',
      stripMetadata: true,
      fixOrientation: true,
      mode: 'quality',
      enableDualPass: false,
      enableProgressive: false,
      enableNoiseAware: false,
      enableHdrToSdr: false,
      enableColorWeighting: false,
      enableSmartQuality: true,
      strict: true,
      onProgress: (progress) => {
        console.log(`Worker progress: ${(progress * 100).toFixed(0)}%`);
      },
    });

    return result;
  } finally {
    worker.terminate();
  }
}
```

## Multiple Compressions in Worker

```typescript
import { createWorker } from 'pixu/worker/client';

async function compressMultiple(files: File[]) {
  const worker = await createWorker();

  try {
    const results = await Promise.all(
      files.map((file, index) => {
        console.log(`Compressing file ${index + 1}/${files.length}`);
        return worker.compress(file, {
          quality: 0.8,
          maxWidth: 1920,
          onProgress: (progress) => {
            console.log(`File ${index + 1} progress: ${(progress * 100).toFixed(0)}%`);
          },
        });
      })
    );

    console.log(`Compressed ${results.length} files`);
    return results;
  } finally {
    worker.terminate();
  }
}
```

## Worker with Advanced Features

```typescript
import { createWorker } from 'pixu/worker/client';

async function compressAdvanced(file: File) {
  const worker = await createWorker();

  try {
    const result = await worker.compress(file, {
      quality: 0.8,
      maxWidth: 1920,
      maxHeight: 1080,
      format: 'auto',
      stripMetadata: true,
      fixOrientation: true,
      enableSmartQuality: true,
      optimizePNG: {
        enabled: true,
        reduceColors: true,
        maxColors: 128,
        optimizeTransparency: true,
      },
      filters: [
        { type: 'brightness', value: 1.05 },
        { type: 'contrast', value: 1.1 },
      ],
      monitorPerformance: true,
      onProgress: (progress) => {
        console.log(`Progress: ${(progress * 100).toFixed(0)}%`);
      },
    });

    if (result.metrics) {
      console.log('Worker metrics:', result.metrics);
    }

    return result;
  } finally {
    worker.terminate();
  }
}
```

## Worker Error Handling

```typescript
import { createWorker } from 'pixu/worker/client';

async function safeWorkerCompress(file: File) {
  const worker = await createWorker();

  try {
    const result = await worker.compress(file, {
      quality: 0.8,
      validateImage: true,
    });

    return { success: true, result };
  } catch (error) {
    if (error instanceof Error) {
      console.error('Worker compression failed:', error.message);
      return { success: false, error: error.message };
    }
    return { success: false, error: 'Unknown error' };
  } finally {
    worker.terminate();
  }
}
```

## Worker Pool Pattern

```typescript
import { createWorker } from 'pixu/worker/client';

class WorkerPool {
  private workers: Array<Awaited<ReturnType<typeof createWorker>>> = [];
  private maxWorkers: number;

  constructor(maxWorkers: number = 3) {
    this.maxWorkers = maxWorkers;
  }

  async getWorker() {
    if (this.workers.length < this.maxWorkers) {
      const worker = await createWorker();
      this.workers.push(worker);
      return worker;
    }
    return this.workers[0];
  }

  async compress(file: File, options: any) {
    const worker = await this.getWorker();
    return worker.compress(file, options);
  }

  terminateAll() {
    this.workers.forEach(worker => worker.terminate());
    this.workers = [];
  }
}

async function useWorkerPool(files: File[]) {
  const pool = new WorkerPool(3);

  try {
    const results = await Promise.all(
      files.map(file => pool.compress(file, {
        quality: 0.8,
        maxWidth: 1920,
      }))
    );

    return results;
  } finally {
    pool.terminateAll();
  }
}
```

## Complete Worker Example

```typescript
import { createWorker } from 'pixu/worker/client';

async function compressInWorker(file: File) {
  console.log('Starting worker compression...');
  console.log('File:', file.name, file.size, 'bytes');

  const worker = await createWorker();
  
  try {
    const result = await worker.compress(file, {
      quality: 0.8,
      maxWidth: 1920,
      maxHeight: 1080,
      format: 'image/webp',
      stripMetadata: true,
      fixOrientation: true,
      enableSmartQuality: true,
      monitorPerformance: true,
      onProgress: (progress) => {
        console.log(`Compression progress: ${(progress * 100).toFixed(0)}%`);
      },
    });

    console.log('Compression complete:');
    console.log('  Original:', result.originalSize, 'bytes');
    console.log('  Compressed:', result.compressedSize, 'bytes');
    console.log('  Ratio:', (result.compressionRatio * 100).toFixed(1) + '%');
    console.log('  Format:', result.format);
    console.log('  Dimensions:', result.width + 'x' + result.height);

    if (result.metrics) {
      console.log('  Duration:', result.metrics.duration, 'ms');
      console.log('  Throughput:', result.metrics.throughput, 'bytes/s');
    }

    return result;
  } catch (error) {
    console.error('Worker compression failed:', error);
    throw error;
  } finally {
    worker.terminate();
    console.log('Worker terminated');
  }
}
```


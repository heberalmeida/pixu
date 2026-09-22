# Batch Processing

Process multiple images efficiently with advanced batch operations.

## Basic Batch

```typescript
import { compressBatch } from '@pantanal/pixu';

const results = await compressBatch(files, {
  quality: 0.8,
  concurrency: 3,
});
```

## Advanced Batch Processor

```typescript
import { AdvancedBatchProcessor } from '@pantanal/pixu';

const processor = new AdvancedBatchProcessor();

const results = await processor.processBatch(files, {
  quality: 0.8,
  concurrency: 3,
  retryAttempts: 2,
  retryDelay: 1000,
  priority: 'size-asc',
  onProgress: (completed, total, errors) => {
    console.log(`Progress: ${completed}/${total} (${errors} errors)`);
  },
  onItemComplete: (result, index) => {
    console.log(`File ${index + 1} completed`);
  },
});
```

## Priority Options

Control processing order:

- `fifo` - First in, first out
- `lifo` - Last in, first out
- `size-asc` - Smallest files first
- `size-desc` - Largest files first

## Pause and Resume

```typescript
const processor = new AdvancedBatchProcessor();

processor.pause();

setTimeout(() => {
  processor.resume();
}, 5000);
```

## Cancel

```typescript
processor.cancel();
```

## Progress Tracking

```typescript
const processor = new AdvancedBatchProcessor();

processor.processBatch(files, {
  onProgress: (completed, total, errors) => {
    const percentage = (completed / total) * 100;
    console.log(`${percentage.toFixed(1)}% complete`);
  },
});
```

## Retry on Failure

```typescript
const processor = new AdvancedBatchProcessor();

processor.processBatch(files, {
  retryAttempts: 3,
  retryDelay: 2000,
  onItemError: (error, index) => {
    console.error(`File ${index + 1} failed:`, error);
  },
});
```

## Complete Example

```typescript
import { AdvancedBatchProcessor, formatBytes } from '@pantanal/pixu';

async function processImageBatch(files: File[]) {
  console.log(`Processing ${files.length} files...`);

  const processor = new AdvancedBatchProcessor();
  const startTime = Date.now();

  const results = await processor.processBatch(files, {
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
    },
    concurrency: 3,
    retryAttempts: 2,
    retryDelay: 1000,
    priority: 'size-asc',
    onProgress: (completed, total, errors) => {
      const percentage = (completed / total) * 100;
      const elapsed = (Date.now() - startTime) / 1000;
      const rate = completed / elapsed;
      const remaining = (total - completed) / rate;

      console.log(`Progress: ${completed}/${total} (${errors} errors) - ${percentage.toFixed(1)}%`);
      console.log(`Rate: ${rate.toFixed(2)} files/sec`);
      console.log(`Estimated time remaining: ${remaining.toFixed(1)}s`);

      updateProgressBar(percentage);
    },
    onItemComplete: (result, index) => {
      const ratio = (result.compressionRatio * 100).toFixed(1);
      console.log(` ${files[index].name}: ${formatBytes(result.compressedSize)} (${ratio}% reduction)`);
    },
    onItemError: (error, index) => {
      console.error(` ${files[index].name}: ${error.message}`);
    },
  });

  const totalTime = (Date.now() - startTime) / 1000;
  const totalOriginal = results.reduce((sum, r) => sum + r.originalSize, 0);
  const totalCompressed = results.reduce((sum, r) => sum + r.compressedSize, 0);
  const totalRatio = ((totalOriginal - totalCompressed) / totalOriginal) * 100;

  console.log('Batch processing complete:');
  console.log(`  Total time: ${totalTime.toFixed(2)}s`);
  console.log(`  Total original: ${formatBytes(totalOriginal)}`);
  console.log(`  Total compressed: ${formatBytes(totalCompressed)}`);
  console.log(`  Total reduction: ${totalRatio.toFixed(1)}%`);
  console.log(`  Average rate: ${(files.length / totalTime).toFixed(2)} files/sec`);

  return results;
}

function updateProgressBar(percentage: number) {
  const progressBar = document.getElementById('batch-progress') as HTMLProgressElement;
  const progressText = document.getElementById('progress-text') as HTMLElement;
  if (progressBar) {
    progressBar.value = percentage;
  }
  if (progressText) {
    progressText.textContent = `${percentage.toFixed(1)}%`;
  }
}
```


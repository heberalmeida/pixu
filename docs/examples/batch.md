# Batch Processing Examples

Examples for processing multiple images.

## Basic Batch

<CompressionDemo :options="{ quality: 0.8 }" />

```typescript
import { compressBatch } from 'pixu';

async function basicBatch(files: File[]) {
  const results = await compressBatch(files, {
    quality: 0.8,
    concurrency: 3,
  });

  console.log(`Compressed ${results.length} files`);
  results.forEach((result, index) => {
    console.log(`File ${index + 1}: ${result.compressedSize} bytes`);
  });

  return results;
}
```

## Batch with All Options

```typescript
import { compressBatch } from 'pixu';

async function batchWithAllOptions(files: File[]) {
  const results = await compressBatch(files, {
    quality: 0.8,
    maxWidth: 1920,
    maxHeight: 1080,
    minWidth: 320,
    minHeight: 240,
    resize: 'contain',
    format: 'auto',
    stripMetadata: true,
    fixOrientation: true,
    mode: 'quality',
    enableSmartQuality: true,
    optimizePNG: {
      enabled: true,
      reduceColors: true,
      maxColors: 128,
    },
    filters: [{ type: 'brightness', value: 1.05 }],
    convertToJPEG: true,
    validateImage: true,
    strict: true,
    concurrency: 3,
    onItemComplete: (result, index) => {
      console.log(`File ${index + 1} completed: ${result.compressedSize} bytes`);
    },
    onItemError: (error, index) => {
      console.error(`File ${index + 1} failed:`, error.message);
    },
  });

  return results;
}
```

## Advanced Batch Processor

```typescript
import { AdvancedBatchProcessor } from 'pixu';

async function advancedBatch(files: File[]) {
  const processor = new AdvancedBatchProcessor();

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
      console.log(`Progress: ${completed}/${total} (${errors} errors) - ${percentage.toFixed(1)}%`);
      updateProgressBar(percentage);
    },
    onItemComplete: (result, index) => {
      console.log(`File ${index + 1} completed: ${result.compressedSize} bytes`);
    },
    onItemError: (error, index) => {
      console.error(`File ${index + 1} failed:`, error.message);
    },
  });

  return results;
}

function updateProgressBar(percentage: number) {
  const progressBar = document.getElementById('batch-progress') as HTMLProgressElement;
  if (progressBar) {
    progressBar.value = percentage;
  }
}
```

## Batch with Pause and Resume

```typescript
import { AdvancedBatchProcessor } from 'pixu';

async function batchWithPauseResume(files: File[]) {
  const processor = new AdvancedBatchProcessor();

  const processPromise = processor.processBatch(files, {
    quality: 0.8,
    concurrency: 2,
    onProgress: (completed, total) => {
      console.log(`Progress: ${completed}/${total}`);
    },
  });

  setTimeout(() => {
    console.log('Pausing batch...');
    processor.pause();
  }, 2000);

  setTimeout(() => {
    console.log('Resuming batch...');
    processor.resume();
  }, 5000);

  const results = await processPromise;
  return results;
}
```

## Batch with Priority

```typescript
import { AdvancedBatchProcessor } from 'pixu';

async function batchByPriority(files: File[]) {
  const processor = new AdvancedBatchProcessor();

  const resultsFIFO = await processor.processBatch(files, {
    quality: 0.8,
    priority: 'fifo',
  });

  const resultsLIFO = await processor.processBatch(files, {
    quality: 0.8,
    priority: 'lifo',
  });

  const resultsSizeAsc = await processor.processBatch(files, {
    quality: 0.8,
    priority: 'size-asc',
  });

  const resultsSizeDesc = await processor.processBatch(files, {
    quality: 0.8,
    priority: 'size-desc',
  });

  return {
    fifo: resultsFIFO,
    lifo: resultsLIFO,
    sizeAsc: resultsSizeAsc,
    sizeDesc: resultsSizeDesc,
  };
}
```

## Batch with Retry

```typescript
import { AdvancedBatchProcessor } from 'pixu';

async function batchWithRetry(files: File[]) {
  const processor = new AdvancedBatchProcessor();

  const results = await processor.processBatch(files, {
    quality: 0.8,
    concurrency: 3,
    retryAttempts: 3,
    retryDelay: 2000,
    onItemError: (error, index) => {
      console.error(`File ${index + 1} failed after retries:`, error.message);
    },
  });

  return results;
}
```

## Batch Progress Monitoring

```typescript
import { AdvancedBatchProcessor } from 'pixu';

async function batchWithMonitoring(files: File[]) {
  const processor = new AdvancedBatchProcessor();

  const startTime = Date.now();
  let completed = 0;
  let errors = 0;

  const results = await processor.processBatch(files, {
    quality: 0.8,
    concurrency: 3,
    onProgress: (comp, total, errs) => {
      completed = comp;
      errors = errs;
      const elapsed = (Date.now() - startTime) / 1000;
      const rate = completed / elapsed;
      const remaining = (total - completed) / rate;
      console.log(`Progress: ${completed}/${total}`);
      console.log(`Rate: ${rate.toFixed(2)} files/sec`);
      console.log(`Estimated time remaining: ${remaining.toFixed(1)}s`);
    },
  });

  const totalTime = (Date.now() - startTime) / 1000;
  console.log(`Batch complete in ${totalTime.toFixed(2)}s`);
  console.log(`Success: ${results.length - errors}, Errors: ${errors}`);

  return results;
}
```

## Complete Batch Example

```typescript
import { AdvancedBatchProcessor, formatBytes } from 'pixu';

async function processImageBatch(files: File[]) {
  console.log(`Processing ${files.length} files...`);

  const processor = new AdvancedBatchProcessor();
  
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
      console.log(`Progress: ${completed}/${total} (${errors} errors) - ${percentage.toFixed(1)}%`);
      updateProgressBar(percentage);
    },
    onItemComplete: (result, index) => {
      const ratio = (result.compressionRatio * 100).toFixed(1);
      console.log(`✓ ${files[index].name}: ${formatBytes(result.compressedSize)} (${ratio}% reduction)`);
    },
    onItemError: (error, index) => {
      console.error(`✗ ${files[index].name}: ${error.message}`);
    },
  });

  const totalOriginal = results.reduce((sum, r) => sum + r.originalSize, 0);
  const totalCompressed = results.reduce((sum, r) => sum + r.compressedSize, 0);
  const totalRatio = ((totalOriginal - totalCompressed) / totalOriginal) * 100;

  console.log('Batch summary:');
  console.log(`  Total original: ${formatBytes(totalOriginal)}`);
  console.log(`  Total compressed: ${formatBytes(totalCompressed)}`);
  console.log(`  Total reduction: ${totalRatio.toFixed(1)}%`);

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


# Exemplos avançados

Exemplos de uso avançado com vários recursos.

## Vários recursos combinados

<CompressionDemo :options="{ quality: 0.8, maxWidth: 1920, maxHeight: 1080, resize: 'contain', format: 'image/pixu', stripMetadata: true, fixOrientation: true, enableSmartQuality: true }" />

```typescript
import { compress } from '@pantanal/pixu';

async function advancedCompress(file: File) {
  const result = await compress(file, {
    quality: 0.8,
    maxWidth: 1920,
    maxHeight: 1080,
    resize: 'contain',
    format: 'image/pixu', // Using PIX format for best compression
    stripMetadata: true,
    fixOrientation: true,
    enableSmartQuality: true,
    optimizePNG: {
      enabled: true,
      reduceColors: true,
      maxColors: 128,
      optimizeTransparency: true,
    },
    smartCrop: {
      enabled: true,
      width: 1920,
      height: 1080,
      focus: 'center',
    },
    watermark: {
      text: 'Copyright 2025',
      position: 'bottom-right',
      opacity: 0.7,
      fontSize: 16,
      fontFamily: 'Arial',
      color: '#ffffff',
      padding: 10,
    },
    filters: [
      'sepia',
      { type: 'brightness', value: 1.1 },
      { type: 'contrast', value: 1.05 },
    ],
    convertToJPEG: true,
    validateImage: true,
    monitorPerformance: true,
    onProgress: (progress) => {
      console.log(`Progress: ${(progress * 100).toFixed(0)}%`);
    },
  });

  if (result.metrics) {
    console.log('Performance metrics:', result.metrics);
  }

  return result;
}
```

## Análise de imagem e otimização

```typescript
import { compress, analyzeImage, getOptimizationHints, estimateCompressionSavings } from '@pantanal/pixu';

async function optimizeImage(file: File) {
  const img = new Image();
  img.src = URL.createObjectURL(file);

  await new Promise<void>((resolve, reject) => {
    img.onload = () => resolve();
    img.onerror = () => reject(new Error('Failed to load image'));
  });

  const canvas = document.createElement('canvas');
  canvas.width = img.naturalWidth;
  canvas.height = img.naturalHeight;
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Failed to get canvas context');
  ctx.drawImage(img, 0, 0);

  const analysis = await analyzeImage(canvas, file.size);
  const hints = await getOptimizationHints(file, canvas, {});
  const estimatedSavings = estimateCompressionSavings(file, {
    quality: analysis.recommendedQuality,
    format: analysis.recommendedFormat as any,
    maxWidth: 1920,
  });

  console.log('Content type:', analysis.contentType);
  console.log('Complexity:', analysis.complexity);
  console.log('Recommended format:', analysis.recommendedFormat);
  console.log('Recommended quality:', analysis.recommendedQuality);
  console.log('Estimated savings:', (estimatedSavings * 100).toFixed(1) + '%');
  console.log('Optimization hints:', hints);

  const result = await compress(file, {
    quality: analysis.recommendedQuality,
    format: analysis.recommendedFormat as any,
    maxWidth: 1920,
    enableSmartQuality: true,
  });

  URL.revokeObjectURL(img.src);
  return result;
}
```

## Processamento em lote com recursos avançados

```typescript
import { AdvancedBatchProcessor } from '@pantanal/pixu';

async function processBatchAdvanced(files: File[]) {
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
      console.log(`Progress: ${completed}/${total} (${errors} errors)`);
      const percentage = (completed / total) * 100;
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

## Fluxo completo com todos os recursos

```typescript
import { 
  compress, 
  validateImage, 
  analyzeImage, 
  getOptimizationHints,
  formatBytes,
  formatDuration
} from '@pantanal/pixu';

async function processImage(file: File) {
  console.log('Starting image processing...');
  console.log('File:', file.name, formatBytes(file.size));

  const validation = await validateImage(file);
  if (!validation.isValid) {
    throw new Error(`Invalid image: ${validation.errors.join(', ')}`);
  }

  if (validation.warnings.length > 0) {
    console.warn('Validation warnings:', validation.warnings);
  }

  console.log('Image dimensions:', validation.dimensions);
  console.log('Actual format:', validation.actualFormat);

  const img = new Image();
  img.src = URL.createObjectURL(file);

  await new Promise<void>((resolve, reject) => {
    img.onload = () => resolve();
    img.onerror = () => reject(new Error('Failed to load image'));
  });

  const canvas = document.createElement('canvas');
  canvas.width = img.naturalWidth;
  canvas.height = img.naturalHeight;
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Failed to get canvas context');
  ctx.drawImage(img, 0, 0);

  const analysis = await analyzeImage(canvas, file.size);
  const hints = await getOptimizationHints(file, canvas, {});

  console.log('Image analysis:');
  console.log('  Content type:', analysis.contentType);
  console.log('  Complexity:', analysis.complexity);
  console.log('  Quality level:', analysis.quality);
  console.log('  Color count:', analysis.colorCount);
  console.log('  Has transparency:', analysis.hasTransparency);

  console.log('Optimization hints:');
  hints.forEach(hint => {
    console.log(`  [${hint.priority}] ${hint.message}`);
    console.log(`    Suggestion: ${hint.suggestion}`);
  });

  const options = {
    quality: analysis.recommendedQuality,
    format: analysis.recommendedFormat as any,
    maxWidth: 1920,
    maxHeight: 1080,
    resize: 'contain',
    stripMetadata: true,
    fixOrientation: true,
    enableSmartQuality: true,
    optimizePNG: analysis.hasTransparency ? {
      enabled: true,
      reduceColors: analysis.colorCount > 128,
      maxColors: 128,
      optimizeTransparency: true,
    } : undefined,
    convertToJPEG: !analysis.hasTransparency && file.size > 500000,
    monitorPerformance: true,
    onProgress: (progress: number) => {
      console.log(`Compression progress: ${(progress * 100).toFixed(0)}%`);
    },
  };

  const result = await compress(file, options);

  console.log('Processing complete');
  console.log('Results:');
  console.log('  Original:', formatBytes(result.originalSize));
  console.log('  Compressed:', formatBytes(result.compressedSize));
  console.log('  Ratio:', (result.compressionRatio * 100).toFixed(1) + '%');
  console.log('  Format:', result.format);
  console.log('  Dimensions:', result.width + 'x' + result.height);

  if (result.metrics) {
    console.log('Performance metrics:');
    console.log('  Duration:', formatDuration(result.metrics.duration || 0));
    console.log('  Throughput:', formatBytes(result.metrics.throughput || 0) + '/s');
    console.log('  Memory used:', formatBytes(result.metrics.memoryUsed || 0));
  }

  URL.revokeObjectURL(img.src);
  return result;
}
```

# Quick Start

Get started with Pixu in minutes.

## Basic Compression

<CompressionDemo :options="{ quality: 0.8 }" />

```typescript
import { compress } from 'pixu';

const fileInput = document.querySelector('input[type="file"]');

fileInput.addEventListener('change', async (e) => {
  const file = e.target.files[0];
  if (!file) return;

  const result = await compress(file, {
    quality: 0.8,
  });

  console.log('Compressed:', result);
});
```

## With Resize

<CompressionDemo :options="{ quality: 0.8, maxWidth: 1920, maxHeight: 1080 }" />

```typescript
const result = await compress(file, {
  quality: 0.8,
  maxWidth: 1920,
  maxHeight: 1080,
});
```

## Using Presets

<CompressionDemo :options="{ preset: 'web' }" />

```typescript
const result = await compress(file, {
  preset: 'web',
});
```

## With Progress Tracking

<CompressionDemo :options="{ quality: 0.8 }" />

```typescript
const result = await compress(file, {
  quality: 0.8,
  onProgress: (progress) => {
    console.log(`Progress: ${(progress * 100).toFixed(0)}%`);
  },
});
```

## Web Worker

```typescript
import { WorkerCompressor } from 'pixu/worker/client';

const worker = new WorkerCompressor('/path/to/pixu.worker.esm.js');

const result = await worker.compress(file, {
  quality: 0.8,
});
```

## Batch Processing

```typescript
import { compressBatch } from 'pixu';

const results = await compressBatch(files, {
  quality: 0.8,
  concurrency: 3,
});
```

## Error Handling

```typescript
try {
  const result = await compress(file, {
    quality: 0.8,
  });
} catch (error) {
  if (error instanceof Error) {
    console.error('Compression failed:', error.message);
  }
}
```

## Using PIXU Format (Best Compression)

<CompressionDemo :options="{ quality: 0.8, format: 'image/pixu' }" />

```typescript
import { compress } from 'pixu';

const result = await compress(file, {
  quality: 0.8,
  format: 'image/pixu', // Revolutionary format, 30-60% better than JPEG
});
```

## Complete Example

```typescript
import { compress } from 'pixu';

async function compressImage(file: File) {
  try {
    const result = await compress(file, {
      quality: 0.8,
      maxWidth: 1920,
      maxHeight: 1080,
      format: 'image/pixu', // Using PIX for best compression
      stripMetadata: true,
      onProgress: (progress) => {
        console.log(`Progress: ${(progress * 100).toFixed(0)}%`);
      },
    });

    console.log(`Original: ${result.originalSize} bytes`);
    console.log(`Compressed: ${result.compressedSize} bytes`);
    console.log(`Ratio: ${(result.compressionRatio * 100).toFixed(1)}%`);

    return result.file;
  } catch (error) {
    console.error('Compression failed:', error);
    throw error;
  }
}
```

## Framework Examples

Ready-to-run apps with real sample photos and UI components:

```bash
npm run build
cd examples/vue   # or react, angular, svelte, jacare
npm install && npm run dev
```

| Framework | Port | Guide |
|-----------|------|-------|
| Vue | 3000 | [/examples/vue](/examples/vue) |
| React | 3001 | [/examples/react-example](/examples/react-example) |
| Angular | 4200 | [/examples/angular](/examples/angular) |
| Svelte | 3002 | [/examples/svelte](/examples/svelte) |
| Jacaré | 3003 | [/examples/jacare](/examples/jacare) |

[Full overview →](/examples/)


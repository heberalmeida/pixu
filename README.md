# Pixu

**Perceptual image compression for JavaScript**, grounded in Contextual Reconstructive Entropy (TECR).

[![npm version](https://img.shields.io/npm/v/pixu.svg)](https://www.npmjs.com/package/pixu)
[![bundle size](https://img.shields.io/bundlephobia/minzip/pixu)](https://bundlephobia.com/package/pixu)
[![TypeScript](https://img.shields.io/badge/TypeScript-Ready-blue)](https://www.typescriptlang.org/)
[![License](https://img.shields.io/badge/license-MIT-green.svg)](LICENSE)

[Features](#features) · [Installation](#installation) · [Quick Start](#quick-start) · [API](#api-reference) · [Examples](#examples) · [Docs](#documentation)

---

## Overview

Pixu is a zero-dependency TypeScript library for **best perceptual compression** on the web. It minimizes shipped bytes given a shared reconstructive model \(M\), content context \(C\), and an allowed perceptual error \(\varepsilon\):

\[
L(x \mid M, C, \varepsilon)
\]

This does **not** claim to break Shannon’s lossless bound. It targets a better problem for images: smaller \(C_{\text{file}}\) at the same visual budget — via the **PIXU** format (`.pixu`).

### Why Pixu?

- **TECR-native** — Optimizes \(L(x\mid M,C,\varepsilon)\); see the [theory guide](https://heberalmeida.github.io/pixu/guide/theory/contextual-reconstructive-entropy)
- **Fast** — Optimized pipelines and Web Worker support
- **Contextual** — Smart Quality builds \(C\) from photo / graphic / text priors
- **Flexible** — Plugins, presets, filters, batch and stream APIs
- **Lightweight** — Zero runtime dependencies (~15KB gzipped)
- **Typed** — Full TypeScript definitions
- **PIXU format** — Reconstructive `image/pixu` — typically 30–60% smaller than JPEG, 20–40% vs WebP at the same visual budget

---

## Features

### Core

- JPEG, PNG, WebP, AVIF, and **PIXU** (`image/pixu`, `.pixu`)
- Resize modes: `contain`, `cover`, `fit`, `fill`
- Quality, target-size, and adaptive modes
- EXIF stripping and orientation correction
- Batch compression with concurrency control
- Streaming API and Web Workers

### Advanced

- Smart Quality (content context \(C\)) — on by default for PIXU
- Dual-pass and noise-aware encoding
- Compression presets (web, print, social, thumbnail, email)
- Image filters, smart crop, watermark
- PNG optimization and format conversion
- Image analysis and optimization hints
- Memory management and performance monitoring

---

## Installation

```bash
npm install pixu
```

```bash
yarn add pixu
```

```bash
pnpm add pixu
```

### CDN

```html
<script type="module">
  import { compress } from 'https://cdn.jsdelivr.net/npm/pixu@latest/dist/pixu.esm.js';
</script>
```

---

## Quick Start

### Best compression (recommended)

```typescript
import { compress, PIXU_EXTENSION } from 'pixu';

const result = await compress(file, {
  format: 'image/pixu',
  enableSmartQuality: true,
  stripMetadata: true,
  maxWidth: 1920,
  maxHeight: 1080,
});

console.log(result.compressionRatio);
console.log(PIXU_EXTENSION); // ".pixu"
```

### Basic usage

```typescript
import { compress } from 'pixu';

const fileInput = document.querySelector('input[type="file"]');

fileInput.addEventListener('change', async (e) => {
  const file = e.target.files[0];
  if (!file) return;

  const result = await compress(file, {
    format: 'image/pixu',
    enableSmartQuality: true,
    maxWidth: 1920,
    maxHeight: 1080,
    stripMetadata: true,
  });

  console.log(`${result.originalSize} → ${result.compressedSize} bytes`);
  console.log(`${(result.compressionRatio * 100).toFixed(1)}% reduction`);
});
```

### Advanced options

```typescript
import { compress } from 'pixu';

const result = await compress(file, {
  maxWidth: 1920,
  maxHeight: 1080,
  resize: 'contain',
  format: 'image/pixu',
  mode: 'adaptive',
  quality: 0.8,
  enableDualPass: true,
  enableNoiseAware: true,
  stripMetadata: true,
  fixOrientation: true,
  onProgress: (progress) => {
    console.log(`${Math.round(progress * 100)}%`);
  },
});
```

### Web Worker

```typescript
import { WorkerCompressor } from 'pixu/worker';

const worker = new WorkerCompressor('/path/to/pixu.worker.esm.js');
const result = await worker.compress(file, { quality: 0.8, maxWidth: 1920 });
worker.terminate();
```

### Batch

```typescript
import { compressBatch } from 'pixu';

const results = await compressBatch(files, {
  format: 'image/pixu',
  enableSmartQuality: true,
  concurrency: 3,
  onItemComplete: (result, index) => {
    console.log(`Image ${index + 1} done`);
  },
});
```

### Stream

```typescript
import { compressStream } from 'pixu';

for await (const result of compressStream(files, { quality: 0.8 })) {
  console.log('Compressed:', result.file.name);
}
```

---

## Framework components

| Framework | Import |
|-----------|--------|
| Vue | `pixu/components/vue/PixuCompressor.vue` |
| React | `pixu/components/react/PixuCompressor` |
| Angular | `pixu/components/angular/pixu-compressor.component` |
| Svelte | `pixu/components/svelte/PixuCompressor.svelte` |
| Jacaré | `pixu/components/jacare/PixuCompressor.jcr` |

Runnable apps live in `examples/` (Vue `:3000`, React `:3001`, Svelte `:3002`, Jacaré `:3003`, Angular `:4200`). Build the library first: `npm run build`.

---

## API Reference

### `compress(file, options?)`

- **file:** `File | Blob`
- **options:** `CompressionOptions` (optional)
- **returns:** `Promise<CompressionResult>`

### `CompressionOptions` (summary)

```typescript
interface CompressionOptions {
  maxWidth?: number;
  maxHeight?: number;
  resize?: 'none' | 'contain' | 'cover' | 'fit' | 'fill';
  format?: 'auto' | 'image/jpeg' | 'image/png' | 'image/webp' | 'image/avif' | 'image/pixu';
  stripMetadata?: boolean;
  fixOrientation?: boolean;
  mode?: 'quality' | 'size' | 'adaptive';
  quality?: number;
  targetSize?: number;
  enableSmartQuality?: boolean;
  enableDualPass?: boolean;
  enableProgressive?: boolean;
  enableNoiseAware?: boolean;
  preset?: 'social-media' | 'print' | 'web' | 'thumbnail' | 'email';
  onProgress?: (progress: number) => void;
}
```

### `CompressionResult`

```typescript
interface CompressionResult {
  file: File | Blob;
  originalSize: number;
  compressedSize: number;
  compressionRatio: number;
  format: string;
  width: number;
  height: number;
  metadata?: {
    hasExif: boolean;
    orientation?: number;
    quality?: number;
  };
}
```

Full API: [documentation](https://heberalmeida.github.io/pixu/api/compress).

---

## Examples

### Format conversion

```typescript
const result = await compress(pngFile, {
  format: 'image/webp',
  quality: 0.85,
});
```

### Target size

```typescript
const result = await compress(largeFile, {
  mode: 'size',
  targetSize: 500 * 1024,
  enableDualPass: true,
});
```

### Plugin

```typescript
import { PixuCompressor, type Plugin } from 'pixu';

const watermarkPlugin: Plugin = {
  name: 'watermark',
  version: '1.0.0',
  transform: async (canvas) => {
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
    ctx.font = '24px sans-serif';
    ctx.fillText('Watermark', 20, canvas.height - 20);
  },
};

const compressor = new PixuCompressor();
compressor.registerPlugin(watermarkPlugin);
const result = await compressor.compress(file, { quality: 0.8 });
```

---

## Performance

- Typical compress time: 50–200ms per image (size-dependent)
- Streaming-friendly memory use
- Web Workers for non-blocking work
- Configurable batch concurrency

| Image size | Format | Original | Compressed | Ratio | Time |
|------------|--------|----------|------------|-------|------|
| 5.2 MB | JPEG | 5.2 MB | 450 KB | 91.3% | 120ms |
| 3.8 MB | PNG | 3.8 MB | 320 KB | 91.6% | 95ms |
| 2.1 MB | WebP | 2.1 MB | 180 KB | 91.4% | 80ms |

*Indicative numbers; Chrome 120, MacBook Pro M1.*

---

## Browser support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

AVIF needs Chrome 85+, Firefox 93+, or Safari 17+.

---

## Best practices

1. Prefer `format: 'image/pixu'` with `enableSmartQuality: true` for web delivery under TECR.
2. Use Web Workers for large images.
3. Strip metadata when EXIF is not required.
4. Cap dimensions with `maxWidth` / `maxHeight` before encoding.
5. Limit batch concurrency to balance speed and memory.
6. Surface `onProgress` for long-running jobs.

---

## Troubleshooting

**Compression fails** — Check the console; confirm the input is a supported image type.

**High memory use** — Use Workers and smaller batches.

**AVIF unavailable** — Fall back to PIXU, WebP, or JPEG.

**Worker fails to load** — Verify the worker URL and CORS.

---

## Roadmap

- [ ] TECR level 3 — semantic / generative shared model \(M\) with explicit \(C_{\text{model}}\)
- [ ] Animated formats (GIF, animated WebP)
- [ ] SSR-friendly paths
- [ ] Framework hooks
- [ ] CLI

---

## Documentation

- [VitePress docs](https://heberalmeida.github.io/pixu/)
- [TECR theory](https://heberalmeida.github.io/pixu/guide/theory/contextual-reconstructive-entropy)
- [PIXU format](https://heberalmeida.github.io/pixu/guide/features/pixu-format)
- [Framework examples](https://heberalmeida.github.io/pixu/examples/)
- [Issues](https://github.com/heberalmeida/pixu/issues)

---

## License

MIT — see [LICENSE](LICENSE).

## Contributing

Contributions are welcome. Open an issue or pull request on [GitHub](https://github.com/heberalmeida/pixu).

---

Heber Almeida · [GitHub](https://github.com/heberalmeida/pixu) · [npm](https://www.npmjs.com/package/pixu)

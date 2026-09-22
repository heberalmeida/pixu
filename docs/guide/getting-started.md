# Getting Started

Pixu delivers the **best perceptual compression** for the web by optimizing Contextual Reconstructive Entropy — \(L(x \mid M, C, \varepsilon)\) — via the PIXU format. Zero dependencies, full TypeScript, Shannon-honest science.

Read the [TECR theory](/guide/theory/contextual-reconstructive-entropy) for the full model.

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

## First Compression

<CompressionDemo :options="{ format: 'image/pixu', enableSmartQuality: true }" />

```typescript
import { compress } from 'pixu';

const file = document.querySelector('input[type="file"]').files[0];

const result = await compress(file, {
  format: 'image/pixu',
  enableSmartQuality: true,
  stripMetadata: true,
});

console.log(`${result.originalSize} → ${result.compressedSize} bytes`);
console.log(`${(result.compressionRatio * 100).toFixed(1)}% reduction`);
```

## Compression Options

```typescript
const result = await compress(file, {
  quality: 0.8,
  maxWidth: 1920,
  maxHeight: 1080,
  format: 'auto',
  stripMetadata: true,
  fixOrientation: true,
  enableSmartQuality: true,
});
```

## Output Formats

| Format | MIME | Extension | Best for |
|--------|------|-----------|----------|
| PIXU | `image/pixu` | `.webp` / `.jpg` | TECR encode path; native WebP or JPEG output |
| WebP | `image/webp` | `.webp` | Modern browsers |
| AVIF | `image/avif` | `.avif` | Native AVIF pipelines |
| JPEG | `image/jpeg` | `.jpg` | Universal compatibility |
| PNG | `image/png` | `.png` | Transparency, graphics |
| Auto | `auto` | — | Prefers PIXU encode path when possible |

```typescript
import { compress, PIXU_MIME_TYPE, buildDownloadName } from 'pixu';

const result = await compress(file, { format: PIXU_MIME_TYPE });
console.log(result.format); // "image/webp" or "image/jpeg"
console.log(buildDownloadName('out', result.format));
```

Learn more: [PIXU Format](/guide/features/pixu-format) · [Supported Formats](/guide/features/supported-formats)

## Compression Modes

### Quality mode

```typescript
await compress(file, { mode: 'quality', quality: 0.8 });
```

### Size mode

```typescript
await compress(file, { mode: 'size', targetSize: 500 * 1024 });
```

### Adaptive mode

```typescript
await compress(file, { mode: 'adaptive' });
```

## Resize Modes

```typescript
await compress(file, {
  width: 1920,
  height: 1080,
  resize: 'contain',
});
```

| Mode | Behavior |
|------|----------|
| `none` | No resize |
| `contain` | Fit inside box, keep aspect ratio |
| `cover` | Fill box, crop if needed |
| `fit` | Same as contain |
| `fill` | Exact dimensions, may distort |

## Try Sample Images

The [framework examples](/examples/) include real photos you can click to compress instantly:

```typescript
import { compress } from 'pixu';

const res = await fetch('/photo-landscape.jpg');
const blob = await res.blob();
const file = new File([blob], 'photo-landscape.jpg', { type: blob.type });

const result = await compress(file, { format: 'image/pixu' });
```

Or use a UI component with built-in samples:

```vue
<PixuCompressor
  :samples="sampleImages"
  :options="{ quality: 0.85, format: 'image/pixu' }"
  @compress="onDone"
/>
```

## Framework Examples

Prefer a full app? Pick your stack:

| Framework | Guide |
|-----------|-------|
| Vue 3 | [Vue Examples](/examples/vue) |
| React | [React Examples](/examples/react-example) |
| Angular | [Angular Examples](/examples/angular) |
| Svelte | [Svelte Examples](/examples/svelte) |
| Jacaré | [Jacaré Examples](/examples/jacare) |

Run any project:

```bash
npm run build          # from repo root
cd examples/vue        # or react, angular, svelte, jacare
npm install && npm run dev
```

## Next Steps

- [Quick Start](/guide/quick-start) — presets, workers, batch
- [Vue Component](/guide/components/vue) — drag & drop UI
- [Compression Presets](/guide/features/presets)
- [Smart Quality](/guide/features/smart-quality)
- [API: compress()](/api/compress)

# Types

TypeScript definitions for Pixu. Import types from `pixu`:

```typescript
import type {
  CompressionOptions,
  CompressionResult,
  BatchCompressionOptions,
  StreamCompressionOptions,
  Plugin,
  SupportedFormat,
  ResizeMode,
  CompressionMode,
  CompressionStrategy,
  CompressionPreset,
  ImageFilter,
} from 'pixu'
```

---

## CompressionOptions

```typescript
interface CompressionOptions {
  quality?: number
  maxWidth?: number
  maxHeight?: number
  minWidth?: number
  minHeight?: number
  width?: number
  height?: number
  resize?: ResizeMode
  format?: SupportedFormat
  stripMetadata?: boolean
  fixOrientation?: boolean
  mode?: CompressionMode
  targetSize?: number
  strategy?: CompressionStrategy
  preset?: CompressionPreset
  enableDualPass?: boolean
  enableProgressive?: boolean
  enableNoiseAware?: boolean
  enableHdrToSdr?: boolean
  enableColorWeighting?: boolean
  enableSmartQuality?: boolean
  useWorker?: boolean
  workerOptions?: WorkerOptions
  beforeProcess?: (ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement) => void
  afterProcess?: (ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement) => void
  onProgress?: (progress: number) => void
  strict?: boolean
  filters?: Array<ImageFilter | { type: ImageFilter; value?: number }>
  convertToJPEG?: boolean
  validateImage?: boolean
  optimizePNG?: {
    enabled: boolean
    reduceColors?: boolean
    maxColors?: number
    optimizeTransparency?: boolean
  }
  smartCrop?: {
    enabled: boolean
    width: number
    height: number
    focus?: 'center' | 'top' | 'bottom' | 'left' | 'right'
  }
  watermark?: {
    text?: string
    image?: HTMLImageElement | HTMLCanvasElement
    position?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right' | 'center'
    opacity?: number
    fontSize?: number
    fontFamily?: string
    color?: string
    padding?: number
    scale?: number
    rotation?: number
    stroke?: boolean
    strokeColor?: string
  }
  preserveEXIF?: {
    preserve?: string[]
    remove?: string[]
    removeGPS?: boolean
    preserveCopyright?: boolean
  }
  enableProgressiveJPEG?: boolean
  generateResponsive?: boolean
  monitorPerformance?: boolean
}
```

### Field reference

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `quality` | `number` | ~0.8 | Encode quality 0–1 |
| `maxWidth` / `maxHeight` | `number` | — | Downscale upper bounds |
| `minWidth` / `minHeight` | `number` | — | Upscale lower bounds |
| `width` / `height` | `number` | — | Exact output size |
| `resize` | [`ResizeMode`](#resizemode) | — | Fit strategy |
| `format` | [`SupportedFormat`](#supportedformat) | auto-ish | Output MIME / `auto` |
| `stripMetadata` | `boolean` | — | Drop EXIF/metadata |
| `fixOrientation` | `boolean` | — | Apply EXIF orientation |
| `mode` | [`CompressionMode`](#compressionmode) | — | Quality vs size vs adaptive |
| `targetSize` | `number` | — | Aim for byte budget |
| `strategy` | [`CompressionStrategy`](#compressionstrategy) | — | Search aggressiveness |
| `preset` | [`CompressionPreset`](#compressionpreset) | — | Named defaults |
| `enableDualPass` | `boolean` | — | Dual-pass encode |
| `enableSmartQuality` | `boolean` | — | Content-aware quality |
| `enableNoiseAware` | `boolean` | — | Noise-aware tuning |
| `enableHdrToSdr` | `boolean` | — | HDR → SDR tone map |
| `enableColorWeighting` | `boolean` | — | Perceptual color weighting |
| `enableProgressive` / `enableProgressiveJPEG` | `boolean` | — | Progressive JPEG attempt |
| `useWorker` | `boolean` | — | Off-main-thread when available |
| `workerOptions` | `WorkerOptions` | — | Worker tuning |
| `strict` | `boolean` | `true` | Prefer original if not smaller (skipped when canvas mutated) |
| `filters` | filter list | — | See [Filters](/api/filters) |
| `convertToJPEG` | `boolean` | — | Flatten opaque PNG → JPEG when beneficial |
| `validateImage` | `boolean` | `false` | Pre-validate |
| `optimizePNG` | object | — | Palette / alpha optimize |
| `smartCrop` | object | — | Crop before encode |
| `watermark` | object | — | Text/image overlay |
| `preserveEXIF` | object | — | Selective EXIF keep/strip |
| `generateResponsive` | `boolean` | — | Multi-size generation |
| `monitorPerformance` | `boolean` | — | Collect metrics |
| `onProgress` | `(0–1) => void` | — | Progress callback |
| `beforeProcess` / `afterProcess` | canvas hooks | — | Custom draw passes |

---

## CompressionResult

```typescript
interface CompressionResult {
  file: File | Blob
  originalSize: number
  compressedSize: number
  compressionRatio: number
  format: string
  width: number
  height: number
  metadata?: {
    hasExif: boolean
    orientation?: number
    quality?: number
  }
}
```

| Field | Description |
|-------|-------------|
| `compressionRatio` | `max(0, 1 - compressedSize / originalSize)` |
| `metadata.quality` | Effective quality used by the encoder |
| `format` | Output MIME (`image/pixu`, `image/webp`, …) |

---

## BatchCompressionOptions

```typescript
interface BatchCompressionOptions extends CompressionOptions {
  concurrency?: number
  onItemComplete?: (result: CompressionResult, index: number) => void
  onItemError?: (error: Error, index: number) => void
}
```

See [compressBatch](/api/compress-batch).

---

## StreamCompressionOptions

```typescript
interface StreamCompressionOptions extends CompressionOptions {
  chunkSize?: number
  onChunk?: (chunk: Blob, index: number) => void
}
```

See [compressStream](/api/compress-stream).

---

## Plugin

```typescript
interface Plugin {
  name: string
  version: string
  beforeCompress?: (
    file: File | Blob,
    options: CompressionOptions
  ) => Promise<File | Blob> | File | Blob
  afterCompress?: (
    result: CompressionResult,
    options: CompressionOptions
  ) => Promise<CompressionResult> | CompressionResult
  transform?: (
    canvas: HTMLCanvasElement,
    options: CompressionOptions
  ) => Promise<void> | void
}
```

See [Plugins](/api/plugins).

---

## SupportedFormat

```typescript
type SupportedFormat =
  | 'image/jpeg'
  | 'image/png'
  | 'image/webp'
  | 'image/avif'
  | 'image/pixu'
  | 'auto'
```

| Value | Extension | Notes |
|-------|-----------|-------|
| `image/pixu` | `.webp` / `.jpg` | TECR encode path; output is native WebP or JPEG |
| `image/webp` | `.webp` | Broad modern support |
| `image/avif` | `.avif` | Strong standard codec |
| `image/jpeg` | `.jpg` | Universal |
| `image/png` | `.png` | Transparency / graphics |
| `auto` | — | Prefers PIXU → WebP → JPEG |

Constants: [`PIXU_MIME_TYPE`](/api/pixu-format), `buildDownloadName`.

---

## ResizeMode

```typescript
type ResizeMode = 'none' | 'contain' | 'cover' | 'fit' | 'fill'
```

| Mode | Behavior |
|------|----------|
| `none` | No resize mode override |
| `contain` / `fit` | Fit inside box, preserve aspect |
| `cover` | Fill box, may crop |
| `fill` | Stretch to exact size |

---

## CompressionMode

```typescript
type CompressionMode = 'quality' | 'size' | 'adaptive'
```

---

## CompressionStrategy

```typescript
type CompressionStrategy = 'balanced' | 'aggressive' | 'conservative' | 'smart'
```

---

## CompressionPreset

```typescript
type CompressionPreset = 'social-media' | 'print' | 'web' | 'thumbnail' | 'email'
```

See [Presets](/api/presets).

---

## ImageFilter

```typescript
type ImageFilter =
  | 'grayscale' | 'sepia' | 'vintage'
  | 'brightness' | 'contrast' | 'saturation'
  | 'blur' | 'sharpen'
```

See [Filters](/api/filters).

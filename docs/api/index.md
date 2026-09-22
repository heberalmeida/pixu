# API Reference

Complete reference for every public export from `pixu`.

```typescript
import {
  compress,
  compressBatch,
  compressStream,
  PixuCompressor,
  validateImage,
  isValidImage,
  analyzeImage,
  getPresetOptions,
  applyPreset,
  applyFilter,
  applyWatermark,
  calculateSmartCrop,
  optimizePNG,
  convertFormat,
  detectTransparency,
  shouldConvertToJPEG,
  analyzeImageContent,
  getSmartQuality,
  getOptimizationHints,
  estimateCompressionSavings,
  generateResponsiveImages,
  generateSrcset,
  generateSizes,
  analyzeColorSpace,
  normalizeToSRGB,
  supportsWideGamut,
  isProgressiveJPEG,
  supportsProgressiveJPEG,
  PerformanceMonitor,
  formatBytes,
  formatDuration,
  getMemoryInfo,
  shouldUseStreaming,
  calculateChunkSize,
  AdvancedBatchProcessor,
  PluginManager,
  canvasToPixu,
  isPixuSupported,
  PIXU_MIME_TYPE,
  buildDownloadName,
  estimatePixuCompression,
} from 'pixu'
```

## Core

| Export | Description |
|--------|-------------|
| [compress](/api/compress) | Compress one image |
| [compressBatch](/api/compress-batch) | Compress many images with concurrency |
| [compressStream](/api/compress-stream) | Async generator pipeline |
| [PixuCompressor](/api/pixu-compressor) | Class API: abort, plugins, reuse |
| [AdvancedBatchProcessor](/api/advanced-batch) | Retry, priority, pause/cancel |

## Validation and analysis

| Export | Description |
|--------|-------------|
| [validateImage](/api/validate-image) / `isValidImage` | Pre-flight checks |
| [analyzeImage](/api/analyze-image) | Content analysis and recommendations |
| [analyzeImageContent](/api/smart-quality) / `getSmartQuality` | Smart quality helpers |

## Transforms and helpers

| Export | Description |
|--------|-------------|
| [Presets](/api/presets) | `getPresetOptions`, `applyPreset` |
| [Filters](/api/filters) | `applyFilter` |
| [Watermark](/api/watermark-api) | `applyWatermark` |
| [Smart crop](/api/smart-crop-api) | `calculateSmartCrop` |
| [PNG optimization](/api/png-optimization-api) | `optimizePNG` |
| [Format conversion](/api/format-conversion-api) | `convertFormat`, transparency helpers |
| [PIXU format](/api/pixu-format) | Encode / constants / estimates / preview |
| [PIXU encode](/guide/features/pixu-viewer) | TECR path — native `.webp` / `.jpg` output |
| `getOutputExtension` / `buildDownloadName` | Map MIME → file extension for downloads |
| [Responsive](/api/responsive) | `generateResponsiveImages`, srcset helpers |
| [Optimization hints](/api/optimization-hints) | Hints and savings estimates |
| [Color space](/api/color-space) | sRGB / wide-gamut helpers |
| [Progressive JPEG](/api/progressive-jpeg) | Detect progressive support |
| [Performance](/api/performance-api) | `PerformanceMonitor`, formatters |
| [Memory](/api/memory) | Memory / streaming helpers |
| [Plugins](/api/plugins) | `PluginManager`, `Plugin` |

## Types

See [Types](/api/types) for `CompressionOptions`, `CompressionResult`, and related unions.

## Default export

```typescript
import pixu from 'pixu'

await pixu.compress(file, { quality: 0.8 })
```

The default export is a shared `PixuCompressor` instance.

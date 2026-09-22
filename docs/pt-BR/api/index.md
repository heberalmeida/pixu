# Referência da API

Referência completa de todos os exports públicos de `pixu`.

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

## Núcleo

| Export | Descrição |
|--------|-----------|
| [compress](/pt-BR/api/compress) | Comprime uma imagem |
| [compressBatch](/pt-BR/api/compress-batch) | Comprime várias imagens com concorrência |
| [compressStream](/pt-BR/api/compress-stream) | Pipeline com async generator |
| [PixuCompressor](/pt-BR/api/pixu-compressor) | API de classe: abort, plugins, reuso |
| [AdvancedBatchProcessor](/pt-BR/api/advanced-batch) | Retry, prioridade, pause/cancel |

## Validação e análise

| Export | Descrição |
|--------|-----------|
| [validateImage](/pt-BR/api/validate-image) / `isValidImage` | Checagens prévias |
| [analyzeImage](/pt-BR/api/analyze-image) | Análise de conteúdo e recomendações |
| [analyzeImageContent](/pt-BR/api/smart-quality) / `getSmartQuality` | Helpers de smart quality |

## Transformações e helpers

| Export | Descrição |
|--------|-----------|
| [Presets](/pt-BR/api/presets) | `getPresetOptions`, `applyPreset` |
| [Filters](/pt-BR/api/filters) | `applyFilter` |
| [Watermark](/pt-BR/api/watermark-api) | `applyWatermark` |
| [Smart crop](/pt-BR/api/smart-crop-api) | `calculateSmartCrop` |
| [PNG optimization](/pt-BR/api/png-optimization-api) | `optimizePNG` |
| [Format conversion](/pt-BR/api/format-conversion-api) | `convertFormat` e helpers de transparência |
| [PIXU format](/pt-BR/api/pixu-format) | Encode / constantes / estimativas / preview |
| [Encode PIXU](/pt-BR/guide/features/pixu-viewer) | Caminho TECR — saída nativa `.webp` / `.jpg` |
| [Responsive](/pt-BR/api/responsive) | `generateResponsiveImages`, helpers de srcset |
| [Optimization hints](/pt-BR/api/optimization-hints) | Dicas e estimativa de ganho |
| [Color space](/pt-BR/api/color-space) | Helpers sRGB / wide-gamut |
| [Progressive JPEG](/pt-BR/api/progressive-jpeg) | Detectar suporte progressivo |
| [Performance](/pt-BR/api/performance-api) | `PerformanceMonitor`, formatadores |
| [Memory](/pt-BR/api/memory) | Helpers de memória / streaming |
| [Plugins](/pt-BR/api/plugins) | `PluginManager`, `Plugin` |

## Tipos

Veja [Tipos](/pt-BR/api/types) para `CompressionOptions`, `CompressionResult` e unions relacionadas.

## Export default

```typescript
import pixu from 'pixu'

await pixu.compress(file, { quality: 0.8 })
```

O export default é uma instância compartilhada de `PixuCompressor`.

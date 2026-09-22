# compress

Comprime uma única imagem. Este é o ponto de entrada principal do Pixu.

## Assinatura

```typescript
function compress(
  file: File | Blob,
  options?: CompressionOptions
): Promise<CompressionResult>
```

Uses a shared [`PixuCompressor`](/pt-BR/api/pixu-compressor) instance under the hood.

## Parâmetros

### `file`

| | |
|-|-|
| **Type** | `File \| Blob` |
| **Required** | Yes |

Imagem de origem. O MIME type deve ser de imagem (`image/jpeg`, `image/png`, `image/webp`, `image/avif`, etc.).

### `options`

| | |
|-|-|
| **Type** | [`CompressionOptions`](/pt-BR/api/types#compressionoptions) |
| **Required** | No |

Referência completa de opções: [Types](/pt-BR/api/types). Grupos comuns:

| Group | Options |
|-------|---------|
| Quality / size | `quality`, `targetSize`, `mode`, `strategy`, `strict` |
| Dimensions | `maxWidth`, `maxHeight`, `minWidth`, `minHeight`, `width`, `height`, `resize` |
| Format | `format`, `convertToJPEG`, `enableProgressiveJPEG` |
| Smart | `enableSmartQuality`, `preset`, `enableDualPass` |
| Effects | `filters`, `watermark`, `smartCrop`, `optimizePNG` |
| Metadata | `stripMetadata`, `fixOrientation`, `preserveEXIF` |
| Hooks | `onProgress`, `beforeProcess`, `afterProcess`, `validateImage`, `monitorPerformance` |

## Retorno

[`Promise<CompressionResult>`](/pt-BR/api/types#compressionresult)

| Field | Type | Description |
|-------|------|-------------|
| `file` | `File \| Blob` | Compressed output |
| `originalSize` | `number` | Input bytes |
| `compressedSize` | `number` | Output bytes |
| `compressionRatio` | `number` | Savings ratio `1 - compressed/original` (clamped ≥ 0) |
| `format` | `string` | Output MIME type (e.g. `image/pixu`) |
| `width` / `height` | `number` | Output dimensions |
| `metadata?.quality` | `number?` | Effective quality used |
| `metadata?.hasExif` | `boolean?` | Whether EXIF was present |
| `metadata?.orientation` | `number?` | EXIF orientation if known |

## Comportamento

- **`strict` (default `true`)**: if the output is not smaller than the source *and* the canvas was not mutated (watermark, filters, crop, PNG optimize), Pixu may return the original file.
- **Canvas mutations** (watermark / filters / smart crop / PNG optimize) are never discarded for the original file.
- **`format: 'auto'`**: prefers PIXU, then WebP, then JPEG when beneficial.
- **`enableSmartQuality`**: analyzes content and may adjust quality when you omit an explicit `quality`.
- **Worthwhile retries**: if savings are under ~15%, Pixu retries lower qualities and alternate formats from the same canvas.

## Demo ao vivo

<CompressionDemo :options="{ quality: 0.8, maxWidth: 1920, maxHeight: 1080 }" />

## Exemplos

### Basic

```typescript
import { compress } from '@pantanal/pixu'

const result = await compress(file, {
  quality: 0.8,
  maxWidth: 1920,
  maxHeight: 1080,
})

console.log(result.compressedSize, result.format, result.compressionRatio)
```

### PIXU + smart quality

```typescript
import { compress, PIXU_MIME_TYPE, buildDownloadName } from '@pantanal/pixu'

const result = await compress(file, {
  format: PIXU_MIME_TYPE,
  enableSmartQuality: true,
  stripMetadata: true,
})

const name = buildDownloadName('out', result.format)
```

### Watermark

```typescript
const result = await compress(file, {
  quality: 0.85,
  watermark: {
    text: '© Pixu',
    position: 'bottom-right',
    opacity: 0.85,
  },
})
```

### Progresso

```typescript
await compress(file, {
  quality: 0.8,
  onProgress: (p) => {
    // p is 0..1
    progressEl.style.width = `${Math.round(p * 100)}%`
  },
})
```

### With AbortController-style abort

Use [`PixuCompressor`](/pt-BR/api/pixu-compressor) when you need `abort()`:

```typescript
import { PixuCompressor } from '@pantanal/pixu'

const compressor = new PixuCompressor()
const promise = compressor.compress(file, { quality: 0.8 })
// later:
compressor.abort()
```

## Tratamento de erros

```typescript
try {
  const result = await compress(file, options)
} catch (error) {
  if (error instanceof Error) {
    console.error(error.message)
  }
}
```

## Erros comuns

| Message | Cause |
|---------|--------|
| `File must be an image` | Non-image blob / invalid type |
| `Invalid image dimensions` | Zero or unreadable dimensions |
| `Compression was aborted` | `abort()` called mid-run |
| `Compression already in progress` | Same `PixuCompressor` instance reused concurrently |

## Relacionado

- [compressBatch](/pt-BR/api/compress-batch) — many files
- [compressStream](/pt-BR/api/compress-stream) — streaming pipeline
- [Types](/pt-BR/api/types) — full option tables
- [PIXU format](/pt-BR/api/pixu-format) — proprietary encode helpers

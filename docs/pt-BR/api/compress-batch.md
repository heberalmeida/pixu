# compressBatch

Comprime várias imagens com concorrência limitada.

## Assinatura

```typescript
function compressBatch(
  files: (File | Blob)[],
  options?: BatchCompressionOptions
): Promise<CompressionResult[]>
```

## Parâmetros

### `files`

| | |
|-|-|
| **Type** | `(File \| Blob)[]` |
| **Required** | Yes |

Lista ordenada de imagens. Os resultados mantêm a mesma ordem.

### `options`

| | |
|-|-|
| **Type** | [`BatchCompressionOptions`](/pt-BR/api/types#batchcompressionoptions) |

Extends [`CompressionOptions`](/pt-BR/api/types#compressionoptions) with:

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `concurrency` | `number` | `3` | Max parallel compressions |
| `onItemComplete` | `(result, index) => void` | — | Fired when one file succeeds |
| `onItemError` | `(error, index) => void` | — | Fired when one file fails |

All single-file options (`quality`, `format`, `watermark`, …) apply to every item.

## Retorno

`Promise<CompressionResult[]>` — one result per input, same index order.

When `onItemError` is provided, failed items may be omitted from the array (or handled only via the callback, depending on failure path). Prefer checking `onItemError` for robust UIs.

## Tratamento de erros

- **Without `onItemError`**: the first failure rejects the whole promise.
- **With `onItemError`**: failures are reported per item; successful items still resolve.

## Exemplos

### Gallery upload

```typescript
import { compressBatch } from '@pantanal/pixu'

const files = Array.from(input.files ?? [])

const results = await compressBatch(files, {
  quality: 0.8,
  maxWidth: 1920,
  format: 'auto',
  concurrency: 4,
  onItemComplete: (result, index) => {
    console.log(`#${index}`, result.compressedSize)
  },
  onItemError: (error, index) => {
    console.error(`#${index}`, error.message)
  },
})
```

### PIXU batch

```typescript
const results = await compressBatch(files, {
  format: 'image/pixu',
  enableSmartQuality: true,
  stripMetadata: true,
  concurrency: 2,
})
```

## Relacionado

- [AdvancedBatchProcessor](/pt-BR/api/advanced-batch) — retries, priority, pause/cancel
- [compressStream](/pt-BR/api/compress-stream) — one-at-a-time async iteration
- [compress](/pt-BR/api/compress) — single file

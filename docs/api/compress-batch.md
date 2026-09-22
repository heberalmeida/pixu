# compressBatch

Compress multiple images with bounded concurrency.

## Signature

```typescript
function compressBatch(
  files: (File | Blob)[],
  options?: BatchCompressionOptions
): Promise<CompressionResult[]>
```

## Parameters

### `files`

| | |
|-|-|
| **Type** | `(File \| Blob)[]` |
| **Required** | Yes |

Ordered list of images. Results keep the same order.

### `options`

| | |
|-|-|
| **Type** | [`BatchCompressionOptions`](/api/types#batchcompressionoptions) |

Extends [`CompressionOptions`](/api/types#compressionoptions) with:

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `concurrency` | `number` | `3` | Max parallel compressions |
| `onItemComplete` | `(result, index) => void` | — | Fired when one file succeeds |
| `onItemError` | `(error, index) => void` | — | Fired when one file fails |

All single-file options (`quality`, `format`, `watermark`, …) apply to every item.

## Returns

`Promise<CompressionResult[]>` — one result per input, same index order.

When `onItemError` is provided, failed items may be omitted from the array (or handled only via the callback, depending on failure path). Prefer checking `onItemError` for robust UIs.

## Error handling

- **Without `onItemError`**: the first failure rejects the whole promise.
- **With `onItemError`**: failures are reported per item; successful items still resolve.

## Examples

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

## Related

- [AdvancedBatchProcessor](/api/advanced-batch) — retries, priority, pause/cancel
- [compressStream](/api/compress-stream) — one-at-a-time async iteration
- [compress](/api/compress) — single file

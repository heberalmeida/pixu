# compressStream

Compress files as an async generator — process each result before the next starts.

## Signature

```typescript
function compressStream(
  files: AsyncIterable<File | Blob> | Iterable<File | Blob>,
  options?: StreamCompressionOptions
): AsyncGenerator<CompressionResult, void, unknown>
```

## Parameters

### `files`

| | |
|-|-|
| **Type** | `AsyncIterable<File \| Blob> \| Iterable<File \| Blob>` |

Sync arrays, generators, or async iterables (e.g. streaming uploads).

### `options`

| | |
|-|-|
| **Type** | [`StreamCompressionOptions`](/api/types#streamcompressionoptions) |

Extends [`CompressionOptions`](/api/types#compressionoptions) with:

| Option | Type | Description |
|--------|------|-------------|
| `chunkSize` | `number` | Reserved for chunked pipelines |
| `onChunk` | `(chunk: Blob, index: number) => void` | Called after each successful compression |

## Returns

`AsyncGenerator<CompressionResult>` — `for await` each result in order.

## Examples

### Array of files

```typescript
import { compressStream } from '@pantanal/pixu'

for await (const result of compressStream(files, {
  quality: 0.8,
  maxWidth: 1600,
  onChunk: (blob, index) => {
    console.log('done', index, blob.size)
  },
})) {
  await upload(result.file)
}
```

### Async generator source

```typescript
async function* fromUrls(urls: string[]) {
  for (const url of urls) {
    const res = await fetch(url)
    yield await res.blob()
  }
}

for await (const result of compressStream(fromUrls(urls), {
  format: 'image/webp',
  quality: 0.75,
})) {
  console.log(result.compressionRatio)
}
```

### Backpressure-friendly pipeline

```typescript
async function pipeline(files: File[]) {
  const gen = compressStream(files, { quality: 0.8 })
  for await (const result of gen) {
    await slowNetworkUpload(result.file) // waits before next compress
  }
}
```

## When to use

| API | Best for |
|-----|----------|
| `compressBatch` | Parallel throughput, known file list |
| `compressStream` | Sequential processing, memory-sensitive, async sources |
| `AdvancedBatchProcessor` | Retries, pause/cancel, priority queues |

## Related

- [compressBatch](/api/compress-batch)
- [Memory helpers](/api/memory) — `shouldUseStreaming`

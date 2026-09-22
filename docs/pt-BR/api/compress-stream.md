# compressStream

Comprime arquivos como async generator — processe cada resultado antes do próximo.

## Assinatura

```typescript
function compressStream(
  files: AsyncIterable<File | Blob> | Iterable<File | Blob>,
  options?: StreamCompressionOptions
): AsyncGenerator<CompressionResult, void, unknown>
```

## Parâmetros

### `files`

| | |
|-|-|
| **Type** | `AsyncIterable<File \| Blob> \| Iterable<File \| Blob>` |

Sync arrays, generators, or async iterables (e.g. streaming uploads).

### `options`

| | |
|-|-|
| **Type** | [`StreamCompressionOptions`](/pt-BR/api/types#streamcompressionoptions) |

Extends [`CompressionOptions`](/pt-BR/api/types#compressionoptions) with:

| Option | Type | Description |
|--------|------|-------------|
| `chunkSize` | `number` | Reserved for chunked pipelines |
| `onChunk` | `(chunk: Blob, index: number) => void` | Called after each successful compression |

## Retorno

`AsyncGenerator<CompressionResult>` — `for await` each result in order.

## Exemplos

### Array of files

```typescript
import { compressStream } from 'pixu'

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

## Quando usar

| API | Best for |
|-----|----------|
| `compressBatch` | Parallel throughput, known file list |
| `compressStream` | Sequential processing, memory-sensitive, async sources |
| `AdvancedBatchProcessor` | Retries, pause/cancel, priority queues |

## Relacionado

- [compressBatch](/pt-BR/api/compress-batch)
- [Memory helpers](/pt-BR/api/memory) — `shouldUseStreaming`

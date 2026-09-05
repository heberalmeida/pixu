# compressStream

Compress images asynchronously using generators.

## Signature

```typescript
function* compressStream(
  files: AsyncIterable<File | Blob> | Iterable<File | Blob>,
  options?: StreamCompressionOptions
): AsyncGenerator<CompressionResult, void, unknown>
```

## Parameters

### files

Type: `AsyncIterable<File | Blob> | Iterable<File | Blob>`

Iterable or async iterable of image files.

### options

Type: `StreamCompressionOptions`

Stream compression options extending CompressionOptions with:
- `chunkSize?: number` - Size of chunks to process
- `onChunk?: (chunk: Blob, index: number) => void`

## Returns

Type: `AsyncGenerator<CompressionResult, void, unknown>`

Async generator yielding compression results.

## Example

```typescript
import { compressStream } from 'pixu';

async function processFiles(files: File[]) {
  for await (const result of compressStream(files, {
    quality: 0.8,
    onChunk: (chunk, index) => {
      console.log(`Chunk ${index} processed`);
    },
  })) {
    console.log('Compressed:', result);
    await uploadToServer(result.file);
  }
}
```

## With Async Iterable

```typescript
async function* fileGenerator() {
  for (const file of files) {
    yield file;
  }
}

for await (const result of compressStream(fileGenerator(), {
  quality: 0.8,
})) {
  processResult(result);
}
```


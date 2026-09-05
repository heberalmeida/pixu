# compressBatch

Compress multiple images with concurrency control.

## Signature

```typescript
function compressBatch(
  files: (File | Blob)[],
  options?: BatchCompressionOptions
): Promise<CompressionResult[]>
```

## Parameters

### files

Type: `(File | Blob)[]`

Array of image files to compress.

### options

Type: `BatchCompressionOptions`

Batch compression options extending CompressionOptions with:
- `concurrency?: number` - Number of concurrent compressions (default: 3)
- `onItemComplete?: (result: CompressionResult, index: number) => void`
- `onItemError?: (error: Error, index: number) => void`

## Returns

Type: `Promise<CompressionResult[]>`

Array of compression results in the same order as input files.

## Example

```typescript
import { compressBatch } from 'pixu';

const files = Array.from(fileInput.files);

const results = await compressBatch(files, {
  quality: 0.8,
  maxWidth: 1920,
  concurrency: 3,
  onItemComplete: (result, index) => {
    console.log(`File ${index + 1} completed`);
  },
  onItemError: (error, index) => {
    console.error(`File ${index + 1} failed:`, error);
  },
});
```

## Error Handling

If any file fails and no `onItemError` is provided, the promise will reject. With `onItemError`, errors are handled per item and the promise resolves with results for successful compressions.


# Memory helpers

Decide when to stream and how large chunks should be.

## Signature

```typescript
interface MemoryInfo {
  used: number
  available: number
  limit: number
}

function getMemoryInfo(): MemoryInfo
function shouldUseStreaming(fileSize: number): boolean  // typically > 10MB
function calculateChunkSize(
  fileSize: number,
  availableMemory?: number
): number  // clamped ~1–5MB
```

## Example

```typescript
import {
  getMemoryInfo,
  shouldUseStreaming,
  calculateChunkSize,
  compressStream,
  compress,
} from 'pixu'

const mem = getMemoryInfo()
console.log(mem.used, mem.limit)

if (shouldUseStreaming(file.size)) {
  for await (const result of compressStream([file], {
    quality: 0.8,
  })) {
    console.log(result.compressedSize)
  }
} else {
  await compress(file, { quality: 0.8 })
}

const chunk = calculateChunkSize(file.size, mem.available)
```

## Related

- [compressStream](/api/compress-stream)

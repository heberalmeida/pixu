# AdvancedBatchProcessor

Batch compression with retries, priority ordering, pause/resume, and cancel.

## Signature

```typescript
class AdvancedBatchProcessor {
  processBatch(
    files: (File | Blob)[],
    options?: AdvancedBatchOptions
  ): Promise<CompressionResult[]>
  pause(): void
  resume(): void
  cancel(): void
  getProgress(): BatchProgress
}
```

## Options

```typescript
interface AdvancedBatchOptions extends Omit<BatchCompressionOptions, 'onProgress'> {
  retryAttempts?: number      // default 2
  retryDelay?: number         // ms, default 1000
  priority?: 'fifo' | 'lifo' | 'size-asc' | 'size-desc'
  onProgress?: (completed: number, total: number, errors: number) => void
}
```

Also accepts all [`BatchCompressionOptions`](/api/types#batchcompressionoptions) / [`CompressionOptions`](/api/types#compressionoptions) fields except the single-file `onProgress` (use batch `onProgress` instead).

## Progress

```typescript
interface BatchProgress {
  completed: number
  total: number
  errors: number
  inProgress: number
  queued: number
  estimatedTimeRemaining?: number
}
```

## Example

```typescript
import { AdvancedBatchProcessor } from 'pixu'

const processor = new AdvancedBatchProcessor()

const run = processor.processBatch(files, {
  quality: 0.8,
  concurrency: 3,
  retryAttempts: 2,
  priority: 'size-desc',
  onProgress: (done, total, errors) => {
    console.log(`${done}/${total} (errors: ${errors})`)
  },
})

// UI controls
pauseBtn.onclick = () => processor.pause()
resumeBtn.onclick = () => processor.resume()
cancelBtn.onclick = () => processor.cancel()

const results = await run
console.log(processor.getProgress())
```

## Related

- [compressBatch](/api/compress-batch) — simpler parallel API

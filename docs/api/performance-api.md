# Performance monitoring

Track compression timing and throughput.

## Signature

```typescript
interface CompressionMetrics {
  startTime: number
  endTime?: number
  duration?: number
  originalSize: number
  compressedSize: number
  compressionRatio: number
  throughput?: number
  memoryUsed?: number
  memoryPeak?: number
}

class PerformanceMonitor {
  constructor(originalSize: number)
  recordCompression(compressedSize: number): CompressionMetrics
  getMetrics(): CompressionMetrics
}

function formatBytes(bytes: number): string
function formatDuration(ms: number): string
```

## Via compress

```typescript
const result = await compress(file, {
  quality: 0.8,
  monitorPerformance: true,
})
```

## Manual

```typescript
import { PerformanceMonitor, formatBytes, formatDuration, compress } from '@pantanal/pixu'

const monitor = new PerformanceMonitor(file.size)
const result = await compress(file, { quality: 0.8 })
const metrics = monitor.recordCompression(result.compressedSize)

console.log(formatBytes(metrics.compressedSize), formatDuration(metrics.duration ?? 0))
```

## Related

- Guide: [Performance monitoring](/guide/features/performance)

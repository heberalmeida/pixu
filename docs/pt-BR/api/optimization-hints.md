# Optimization hints

Sugere melhorias antes ou depois de escolher opções de compressão.

## Assinatura

```typescript
interface OptimizationHint {
  type: 'format' | 'quality' | 'size' | 'metadata' | 'filter'
  message: string
  suggestion: string
  potentialSavings?: number
  priority: 'low' | 'medium' | 'high'
}

function getOptimizationHints(
  file: File | Blob,
  canvas: HTMLCanvasElement,
  currentOptions: CompressionOptions
): Promise<OptimizationHint[]>

function estimateCompressionSavings(
  file: File | Blob,
  options: CompressionOptions
): number
```

Hints are sorted high → low priority. `estimateCompressionSavings` returns a 0–0.9 style estimate.

## Example

```typescript
import { getOptimizationHints, estimateCompressionSavings, compress } from 'pixu'

const hints = await getOptimizationHints(file, canvas, { quality: 0.95 })
hints.filter((h) => h.priority === 'high').forEach((h) => console.log(h.suggestion))

const expected = estimateCompressionSavings(file, { quality: 0.75, format: 'image/webp' })
const result = await compress(file, { quality: 0.75, format: 'image/webp' })
```

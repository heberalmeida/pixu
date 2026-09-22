# Smart quality helpers

Content analysis used when `enableSmartQuality: true`.

## Signature

```typescript
interface ContentAnalysis {
  isPhoto: boolean
  isGraphic: boolean
  hasText: boolean
  complexity: 'low' | 'medium' | 'high'
  recommendedQuality: number
}

function analyzeImageContent(canvas: HTMLCanvasElement): Promise<ContentAnalysis>

function getSmartQuality(
  options: CompressionOptions,
  analysis: ContentAnalysis
): number
```

`getSmartQuality` returns `options.quality` when set; otherwise `analysis.recommendedQuality`.

## Via compress

```typescript
await compress(file, {
  enableSmartQuality: true,
  format: 'image/pixu',
})
```

## Manual

```typescript
import { analyzeImageContent, getSmartQuality, compress } from 'pixu'

const analysis = await analyzeImageContent(canvas)
const quality = getSmartQuality({}, analysis)
await compress(file, { quality })
```

## Related

- [analyzeImage](/api/analyze-image) — richer recommendations
- Guide: [Smart Quality](/guide/features/smart-quality)

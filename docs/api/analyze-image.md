# analyzeImage

Analyze canvas pixels and return content classification plus compression recommendations.

## Signature

```typescript
function analyzeImage(
  canvas: HTMLCanvasElement,
  originalSize?: number
): Promise<ImageAnalysisResult>
```

## Parameters

| Name | Type | Description |
|------|------|-------------|
| `canvas` | `HTMLCanvasElement` | Image already drawn |
| `originalSize` | `number?` | Original file size in bytes (improves estimates) |

## Returns

```typescript
interface ImageAnalysisResult {
  quality: 'low' | 'medium' | 'high' | 'very-high'
  compressionLevel: number
  contentType: 'photo' | 'graphic' | 'text' | 'mixed'
  hasText: boolean
  complexity: 'low' | 'medium' | 'high'
  colorCount: number
  hasTransparency: boolean
  recommendedFormat: 'image/jpeg' | 'image/png' | 'image/webp' | 'image/avif'
  recommendedQuality: number
  estimatedSizeReduction: number
  suggestions: string[]
}
```

| Field | Description |
|-------|-------------|
| `contentType` | Dominant content class |
| `recommendedFormat` | Suggested MIME |
| `recommendedQuality` | Suggested `quality` (0–1) |
| `estimatedSizeReduction` | Expected savings ratio (0–1) |
| `suggestions` | Human-readable tips |
| `hasTransparency` | Alpha present |
| `complexity` | Detail / noise estimate |

## Example

```typescript
import { analyzeImage, compress } from '@pantanal/pixu'

async function analyzeThenCompress(file: File) {
  const bitmap = await createImageBitmap(file)
  const canvas = document.createElement('canvas')
  canvas.width = bitmap.width
  canvas.height = bitmap.height
  canvas.getContext('2d')!.drawImage(bitmap, 0, 0)
  bitmap.close()

  const analysis = await analyzeImage(canvas, file.size)

  return compress(file, {
    format: analysis.recommendedFormat,
    quality: analysis.recommendedQuality,
  })
}
```

## Related

- [Smart quality](/api/smart-quality) — `analyzeImageContent` / `getSmartQuality`
- [Optimization hints](/api/optimization-hints)
- Guide: [Image analysis](/guide/features/image-analysis)

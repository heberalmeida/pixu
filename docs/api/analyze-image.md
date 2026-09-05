# analyzeImage

Analyze image content and provide optimization recommendations.

## Signature

```typescript
function analyzeImage(
  canvas: HTMLCanvasElement,
  originalSize?: number
): Promise<ImageAnalysisResult>
```

## Parameters

### canvas

Type: `HTMLCanvasElement`

Canvas element with the image drawn.

### originalSize

Type: `number` (optional)

Original file size in bytes.

## Returns

Type: `Promise<ImageAnalysisResult>`

Analysis result containing:
- `quality: 'low' | 'medium' | 'high' | 'very-high'`
- `compressionLevel: number`
- `contentType: 'photo' | 'graphic' | 'text' | 'mixed'`
- `hasText: boolean`
- `complexity: 'low' | 'medium' | 'high'`
- `colorCount: number`
- `hasTransparency: boolean`
- `recommendedFormat: string`
- `recommendedQuality: number`
- `estimatedSizeReduction: number`
- `suggestions: string[]`

## Example

```typescript
import { analyzeImage } from 'pixu';

const img = new Image();
img.src = URL.createObjectURL(file);

await new Promise((resolve) => {
  img.onload = resolve;
});

const canvas = document.createElement('canvas');
canvas.width = img.naturalWidth;
canvas.height = img.naturalHeight;
const ctx = canvas.getContext('2d');
ctx.drawImage(img, 0, 0);

const analysis = await analyzeImage(canvas, file.size);

console.log('Content type:', analysis.contentType);
console.log('Recommended format:', analysis.recommendedFormat);
console.log('Recommended quality:', analysis.recommendedQuality);
console.log('Suggestions:', analysis.suggestions);
```


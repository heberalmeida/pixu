# analyzeImage

Analisa o conteúdo da imagem e fornece recomendações de otimização.

## Assinatura

```typescript
function analyzeImage(
  canvas: HTMLCanvasElement,
  originalSize?: number
): Promise<ImageAnalysisResult>
```

## Parâmetros

### canvas

Tipo: `HTMLCanvasElement`

Elemento canvas com a imagem desenhada.

### originalSize

Tipo: `number` (opcional)

Tamanho original do arquivo em bytes.

## Retorno

Tipo: `Promise<ImageAnalysisResult>`

Resultado da análise contendo:
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

## Exemplo

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

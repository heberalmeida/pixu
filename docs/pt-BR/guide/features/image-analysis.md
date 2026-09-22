# Análise de Imagem

Analise imagens para obter informações detalhadas e sugestões de otimização.

## Análise Básica

```typescript
import { analyzeImage } from 'pixu';

const canvas = document.createElement('canvas');
const ctx = canvas.getContext('2d');
ctx.drawImage(img, 0, 0);

const analysis = await analyzeImage(canvas, file.size);
```

## Resultados da Análise

```typescript
interface ImageAnalysisResult {
  quality: 'low' | 'medium' | 'high' | 'very-high';
  compressionLevel: number;
  contentType: 'photo' | 'graphic' | 'text' | 'mixed';
  hasText: boolean;
  complexity: 'low' | 'medium' | 'high';
  colorCount: number;
  hasTransparency: boolean;
  recommendedFormat: string;
  recommendedQuality: number;
  estimatedSizeReduction: number;
  suggestions: string[];
}
```

## Detecção de Tipo de Conteúdo

```typescript
const analysis = await analyzeImage(canvas, file.size);

if (analysis.contentType === 'photo') {
  console.log('This is a photo');
} else if (analysis.contentType === 'graphic') {
  console.log('This is a graphic');
} else if (analysis.contentType === 'text') {
  console.log('This contains text');
}
```

## Dicas de Otimização

Obtenha sugestões de otimização:

```typescript
import { getOptimizationHints } from 'pixu';

const hints = await getOptimizationHints(file, canvas, {});

hints.forEach(hint => {
  console.log(`${hint.priority}: ${hint.message}`);
  console.log(`Suggestion: ${hint.suggestion}`);
  if (hint.potentialSavings) {
    console.log(`Potential savings: ${(hint.potentialSavings * 100).toFixed(1)}%`);
  }
});
```

## Exemplo Completo

```typescript
import { analyzeImage, getOptimizationHints, compress, estimateCompressionSavings } from 'pixu';

async function analyzeAndOptimize(file: File) {
  console.log('Starting image analysis...');
  console.log('File:', file.name, file.size, 'bytes');

  const img = new Image();
  img.src = URL.createObjectURL(file);

  await new Promise<void>((resolve, reject) => {
    img.onload = () => resolve();
    img.onerror = () => reject(new Error('Failed to load image'));
  });

  const canvas = document.createElement('canvas');
  canvas.width = img.naturalWidth;
  canvas.height = img.naturalHeight;
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Failed to get canvas context');
  ctx.drawImage(img, 0, 0);

  const analysis = await analyzeImage(canvas, file.size);
  const hints = await getOptimizationHints(file, canvas, {});
  const estimatedSavings = estimateCompressionSavings(file, {
    quality: analysis.recommendedQuality,
    format: analysis.recommendedFormat as any,
    maxWidth: 1920,
  });

  console.log('Image Analysis Results:');
  console.log('  Content type:', analysis.contentType);
  console.log('  Complexity:', analysis.complexity);
  console.log('  Quality level:', analysis.quality);
  console.log('  Compression level:', (analysis.compressionLevel * 100).toFixed(1) + '%');
  console.log('  Color count:', analysis.colorCount);
  console.log('  Has transparency:', analysis.hasTransparency);
  console.log('  Has text:', analysis.hasText);

  console.log('Recommendations:');
  console.log('  Format:', analysis.recommendedFormat);
  console.log('  Quality:', analysis.recommendedQuality);
  console.log('  Estimated savings:', (estimatedSavings * 100).toFixed(1) + '%');

  console.log('Optimization Hints:');
  hints.forEach((hint, index) => {
    console.log(`  ${index + 1}. [${hint.priority}] ${hint.message}`);
    console.log(`     Suggestion: ${hint.suggestion}`);
    if (hint.potentialSavings) {
      console.log(`     Potential savings: ${(hint.potentialSavings * 100).toFixed(1)}%`);
    }
  });

  const result = await compress(file, {
    quality: analysis.recommendedQuality,
    format: analysis.recommendedFormat as any,
    maxWidth: 1920,
    enableSmartQuality: true,
    optimizePNG: analysis.hasTransparency ? {
      enabled: true,
      reduceColors: analysis.colorCount > 128,
      maxColors: 128,
      optimizeTransparency: true,
    } : undefined,
  });

  console.log('Optimization complete:');
  console.log('  Original:', result.originalSize, 'bytes');
  console.log('  Compressed:', result.compressedSize, 'bytes');
  console.log('  Actual ratio:', (result.compressionRatio * 100).toFixed(1) + '%');

  URL.revokeObjectURL(img.src);
  return result;
}
```

# Marca d'Água

Adicione marcas d'água a imagens com posicionamento inteligente.

## Marca d'Água de Texto

Adicione marca d'água de texto:

<CompressionDemo :options="{ quality: 0.8, watermark: { text: 'Copyright 2026', position: 'bottom-right', opacity: 0.85, color: '#ffffff' } }" />

<VueDemo :options="{ quality: 0.8, watermark: { text: 'Copyright 2026', position: 'bottom-right', opacity: 0.85, color: '#ffffff' } }" />

```typescript
const result = await compress(file, {
  quality: 0.8,
  watermark: {
    text: 'Copyright 2026',
    position: 'bottom-right',
    opacity: 0.85,
    color: '#ffffff',
  },
});
```

## Marca d'Água de Imagem

Adicione marca d'água de imagem:

```typescript
const watermarkImg = new Image();
watermarkImg.src = 'watermark.png';

watermarkImg.onload = async () => {
  const result = await compress(file, {
    quality: 0.8,
    watermark: {
      image: watermarkImg,
      position: 'bottom-right',
      opacity: 0.5,
      scale: 0.2,
    },
  });
};
```

## Opções de Posição

Posições disponíveis:
- `top-left`
- `top-right`
- `bottom-left`
- `bottom-right`
- `center`

## Opções de Marca d'Água

```typescript
watermark: {
  text?: string;
  image?: HTMLImageElement | HTMLCanvasElement;
  position?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right' | 'center';
  opacity?: number;
  fontSize?: number; // omita para escala automática conforme o tamanho da imagem
  fontFamily?: string;
  color?: string;
  padding?: number;
  scale?: number;
  rotation?: number;
  stroke?: boolean;
  strokeColor?: string;
}
```

## Exemplos Completos

```typescript
import { compress } from '@pantanal/pixu';

async function addWatermark(file: File, watermarkText: string) {
  const result = await compress(file, {
    quality: 0.8,
    maxWidth: 1920,
    watermark: {
      text: watermarkText,
      position: 'bottom-right',
      opacity: 0.7,
      fontSize: 18,
      fontFamily: 'Arial',
      color: '#ffffff',
      padding: 15,
    },
    onProgress: (progress) => {
      console.log(`Watermark progress: ${(progress * 100).toFixed(0)}%`);
    },
  });

  console.log('Watermark added');
  return result.file;
}

async function addLogoWatermark(file: File, logoUrl: string) {
  return new Promise<File>((resolve, reject) => {
    const logo = new Image();
    logo.crossOrigin = 'anonymous';
    logo.onload = async () => {
      try {
        const result = await compress(file, {
          quality: 0.8,
          maxWidth: 1920,
          watermark: {
            image: logo,
            position: 'bottom-right',
            opacity: 0.5,
            scale: 0.2,
            padding: 10,
          },
        });
        resolve(result.file);
      } catch (error) {
        reject(error);
      }
    };
    logo.onerror = () => reject(new Error('Failed to load logo'));
    logo.src = logoUrl;
  });
}

async function addWatermarkAllPositions(file: File, text: string) {
  const positions: Array<'top-left' | 'top-right' | 'bottom-left' | 'bottom-right' | 'center'> = [
    'top-left',
    'top-right',
    'bottom-left',
    'bottom-right',
    'center',
  ];

  const results: Record<string, File> = {};

  for (const position of positions) {
    try {
      const result = await compress(file, {
        quality: 0.8,
        watermark: {
          text,
          position,
          opacity: 0.7,
          fontSize: 16,
          color: '#ffffff',
          padding: 10,
        },
      });
      results[position] = result.file;
      console.log(`Watermark added at ${position}`);
    } catch (error) {
      console.error(`Failed to add watermark at ${position}:`, error);
    }
  }

  return results;
}
```

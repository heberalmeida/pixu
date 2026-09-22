# calculateSmartCrop

Calcula um retângulo de crop para aspect/focus alvo.

## Assinatura

```typescript
interface SmartCropOptions {
  width: number
  height: number
  focus?: 'center' | 'top' | 'bottom' | 'left' | 'right'
}

interface CropResult {
  x: number
  y: number
  width: number
  height: number
}

function calculateSmartCrop(
  canvas: HTMLCanvasElement,
  options: SmartCropOptions
): CropResult
```

## Via compress

```typescript
await compress(file, {
  smartCrop: {
    enabled: true,
    width: 800,
    height: 600,
    focus: 'center',
  },
})
```

## Direto

```typescript
import { calculateSmartCrop } from 'pixu'

const crop = calculateSmartCrop(canvas, { width: 1080, height: 1080, focus: 'top' })
ctx.drawImage(
  canvas,
  crop.x, crop.y, crop.width, crop.height,
  0, 0, crop.width, crop.height
)
```

## Relacionado

- Guide: [Smart cropping](/pt-BR/guide/features/smart-crop)

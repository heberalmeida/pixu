# applyWatermark

Draw text or image watermarks onto a canvas. Prefer `options.watermark` on [`compress`](/pt-BR/api/compress) for end-to-end encoding.

## Assinatura

```typescript
interface WatermarkOptions {
  text?: string
  image?: HTMLImageElement | HTMLCanvasElement
  position?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right' | 'center'
  opacity?: number
  fontSize?: number
  fontFamily?: string
  color?: string
  padding?: number
  scale?: number
  rotation?: number
  stroke?: boolean
  strokeColor?: string
}

function applyWatermark(
  context: CanvasRenderingContext2D,
  canvas: HTMLCanvasElement,
  options: WatermarkOptions
): void
```

No-op when both `text` and `image` are missing.

## Defaults

| Option | Default |
|--------|---------|
| `position` | `'bottom-right'` |
| `opacity` | `0.85` |
| `color` | `'#ffffff'` |
| `stroke` | `true` |
| `fontSize` | Auto-scaled from image size |
| `scale` | `0.2` (image watermarks) |

`fontSize`: omit for auto size; values `0–1` are treated as a fraction of the shorter side; larger values are pixel sizes (scaled up on big images).

## Exemplos

### Through compress

```typescript
await compress(file, {
  watermark: {
    text: '© 2026',
    position: 'bottom-right',
    opacity: 0.85,
  },
})
```

### Manual

```typescript
import { applyWatermark } from '@pantanal/pixu'

applyWatermark(ctx, canvas, {
  text: 'DRAFT',
  position: 'center',
  rotation: -30,
  opacity: 0.4,
})
```

## Relacionado

- Guide: [Watermark](/pt-BR/guide/features/watermark)

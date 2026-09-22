# Filters

Aplica filtros no canvas antes do encode (também via `options.filters` no compress).

## Assinatura

```typescript
type ImageFilter =
  | 'grayscale' | 'sepia' | 'vintage'
  | 'brightness' | 'contrast' | 'saturation'
  | 'blur' | 'sharpen'

interface FilterOptions {
  type: ImageFilter
  value?: number
}

function applyFilter(
  context: CanvasRenderingContext2D,
  canvas: HTMLCanvasElement,
  filter: ImageFilter | FilterOptions,
  value?: number
): void
```

Mutates the canvas in place.

### `value`

| Filters | Range | Notes |
|---------|-------|-------|
| `brightness`, `contrast`, `saturation` | ~0–1 | Intensity |
| `blur`, `sharpen` | ~0–10 | Strength |
| others | — | Usually ignore `value` |

## Via compress

```typescript
await compress(file, {
  quality: 0.85,
  filters: ['grayscale', { type: 'contrast', value: 0.2 }],
})
```

## Direto

```typescript
import { applyFilter } from '@pantanal/pixu'

const ctx = canvas.getContext('2d')!
applyFilter(ctx, canvas, 'sepia')
applyFilter(ctx, canvas, { type: 'blur', value: 2 })
```

## Relacionado

- Guide: [Image filters](/pt-BR/guide/features/filters)

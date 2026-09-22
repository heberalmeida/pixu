# optimizePNG

Otimização PNG in-place no canvas (paleta / transparência).

## Assinatura

```typescript
interface PNGOptimizationOptions {
  reduceColors?: boolean
  maxColors?: number          // 2–256
  optimizeTransparency?: boolean
  removeUnusedColors?: boolean
}

function optimizePNG(
  canvas: HTMLCanvasElement,
  options?: PNGOptimizationOptions
): HTMLCanvasElement
```

Returns the same canvas reference after mutation.

## Via compress

```typescript
await compress(file, {
  format: 'image/png',
  optimizePNG: {
    enabled: true,
    reduceColors: true,
    maxColors: 128,
  },
})
```

## Relacionado

- Guide: [PNG optimization](/pt-BR/guide/features/png-optimization)

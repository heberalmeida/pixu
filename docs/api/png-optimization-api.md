# optimizePNG

In-place PNG-oriented canvas optimization (palette / transparency cleanup).

## Signature

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

## Related

- Guide: [PNG optimization](/guide/features/png-optimization)

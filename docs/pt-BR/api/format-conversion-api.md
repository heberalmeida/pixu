# Format conversion helpers

Helpers de baixo nível usados por `convertToJPEG` e seleção de formato.

## Assinatura

```typescript
interface ConversionOptions {
  backgroundColor?: string  // default '#ffffff' when flattening alpha
}

function convertFormat(
  image: HTMLImageElement | HTMLCanvasElement,
  targetFormat: string,
  options?: ConversionOptions
): Promise<HTMLCanvasElement>

function detectTransparency(
  image: HTMLImageElement | HTMLCanvasElement
): Promise<boolean>

function shouldConvertToJPEG(
  currentFormat: string,
  hasTransparency: boolean,
  fileSize: number
): boolean
```

`shouldConvertToJPEG` returns `true` for large opaque PNGs (roughly > 500KB) where JPEG is likely smaller.

## Via compress

```typescript
await compress(pngFile, {
  convertToJPEG: true,
  quality: 0.85,
})
```

## Relacionado

- Guide: [Format conversion](/pt-BR/guide/features/format-conversion)

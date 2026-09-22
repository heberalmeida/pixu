# Format conversion helpers

Low-level helpers used by `convertToJPEG` and format selection.

## Signature

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

## Related

- Guide: [Format conversion](/guide/features/format-conversion)

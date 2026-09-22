# Responsive helpers

Build srcset-oriented outputs for responsive delivery.

## Signature

```typescript
interface LazyLoadOptions {
  widths: number[]
  formats?: string[]
  quality?: number
  baseName?: string
}

interface ResponsiveImageSet {
  srcset: string
  sizes: string
  src: string
  formats: Array<{ format: string; srcset: string; sizes: string }>
}

function generateResponsiveImages(
  file: File | Blob,
  options: LazyLoadOptions
): Promise<ResponsiveImageSet>

function generateSrcset(
  images: Array<{ url: string; width: number }>
): string

function generateSizes(breakpoints: number[]): string
```

## Example

```typescript
import {
  generateResponsiveImages,
  generateSrcset,
  generateSizes,
} from 'pixu'

const set = await generateResponsiveImages(file, {
  widths: [320, 640, 1280],
  formats: ['image/webp', 'image/jpeg'],
  quality: 0.8,
})

const srcset = generateSrcset([
  { url: '/a-640.webp', width: 640 },
  { url: '/a-1280.webp', width: 1280 },
])

const sizes = generateSizes([640, 1024])
```

Also available as `generateResponsive: true` on [`CompressionOptions`](/api/types#compressionoptions) for compress-time multi-size generation where supported.

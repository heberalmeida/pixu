# Supported Image Formats

Pixu supports a comprehensive range of image formats for input and output.

## Input Formats

Pixu can compress images in the following formats:

### Common Formats

- **JPEG** (`image/jpeg`, `.jpg`, `.jpeg`)
  - Most common format for photos
  - Lossy compression
  - No transparency support

- **PNG** (`image/png`, `.png`)
  - Lossless compression
  - Transparency support
  - Best for graphics and screenshots

- **WebP** (`image/webp`, `.webp`)
  - Modern format with excellent compression
  - Supports both lossy and lossless
  - Transparency support

- **AVIF** (`image/avif`, `.avif`)
  - Next-generation format
  - Best compression ratio
  - Modern browser support

### Additional Formats

- **GIF** (`image/gif`, `.gif`)
  - Animation support
  - Limited color palette

- **BMP** (`image/bmp`, `.bmp`)
  - Uncompressed format
  - Large file sizes

- **SVG** (`image/svg+xml`, `.svg`)
  - Vector format
  - Scalable without quality loss

- **TIFF** (`image/tiff`, `.tiff`, `.tif`)
  - High quality format
  - Often used in professional photography

- **ICO** (`image/x-icon`, `.ico`)
  - Icon format
  - Multiple sizes in one file

## Output Formats

Pixu can output images in optimized formats:

### Standard Formats

1. **JPEG** (`image/jpeg`)
   - Universal browser support
   - Best for photos
   - Configurable quality (0.1 - 0.99)

2. **PNG** (`image/png`)
   - Lossless compression
   - Transparency support
   - Best for graphics

3. **WebP** (`image/webp`)
   - Excellent compression
   - Modern browser support
   - Transparency support

4. **AVIF** (`image/avif`)
   - Best compression ratio
   - Modern browser support
   - High quality

### PIXU encode path

5. **PIXU** (`format: 'image/pixu'`)
   - Reconstructive encode under [TECR](/guide/theory/contextual-reconstructive-entropy)
   - Best \(C_{\text{file}}\) under perceptual \(\varepsilon\)
   - Typically 30–60% smaller than JPEG, 20–40% vs WebP
   - Output is always native **WebP or JPEG** (`.webp` / `.jpg`)
   - Adaptive + Smart Quality context \(C\)
   - See [PIXU Format Guide](./pixu-format.md)

### Auto Selection

Use `format: 'auto'` to let Pixu automatically select the best format:

```typescript
const result = await compress(file, {
  format: 'auto', // Prefers PIXU, then WebP, then original
});
```

## Format Selection Guide

### For Photos

- **Best**: PIXU or WebP
- **Universal**: JPEG
- **Maximum quality**: AVIF

### For Graphics

- **Best**: PNG (if transparency needed) or PIX
- **Compression**: WebP or PIX
- **Lossless**: PNG

### For Web

- **Best**: PIXU (best compression)
- **Modern**: WebP or AVIF
- **Fallback**: JPEG

### For Print

- **Best**: JPEG (high quality)
- **Professional**: TIFF (if supported)

## Format Comparison

| Format | Compression | Quality | Transparency | Browser Support | Best For |
|--------|------------|---------|--------------|-----------------|----------|
| JPEG   | Good       | Good    | No           | Universal       | Photos   |
| PNG    | Fair       | Excellent | Yes        | Universal       | Graphics |
| WebP   | Very Good  | Very Good | Yes        | Modern          | Web      |
| AVIF   | Excellent  | Excellent | Yes        | Modern          | Modern Web |
| **PIXU**| **Best**   | **Excellent** | **Yes** | **Universal** | **Web (Best)** |

## Quality Settings

Different formats support different quality ranges:

- **JPEG/WebP/PIXU**: 0.1 - 0.99 (lower = more compression)
- **PNG**: Lossless (quality setting ignored)
- **AVIF**: 0.1 - 0.99 (excellent at lower qualities)

## Format Conversion

Pixu can automatically convert between formats:

```typescript
// Convert PNG to JPEG (if no transparency)
const result = await compress(pngFile, {
  convertToJPEG: true,
});

// Force specific format
const result = await compress(file, {
  format: 'image/webp',
});
```

## Browser Compatibility

### Universal Support

- JPEG
- PNG
- GIF
- BMP

### Modern Browser Support

- WebP (Chrome, Firefox, Edge, Safari 14+)
- AVIF (Chrome 85+, Firefox 93+, Edge 85+)

### Pixu-Enhanced

- PIXU (Universal via Pixu encoding)

## Recommendations

### Maximum Compression

```typescript
format: 'image/pixu', // or 'auto' (auto selects PIXU)
quality: 0.6,
```

### Balanced

```typescript
format: 'auto', // Automatically selects PIXU for best compression
quality: 0.8,
```

### High Quality

```typescript
format: 'image/pixu', // Best compression even at high quality
quality: 0.9,
```

### Maximum Compatibility

```typescript
format: 'image/jpeg', // Universal browser support
quality: 0.85,
```

## Examples

### Using PIXU Format

```typescript
import { compress } from 'pixu';

const result = await compress(file, {
  format: 'image/pixu',
  quality: 0.85,
  enableSmartQuality: true,
});
```

### Auto Format Selection

```typescript
const result = await compress(file, {
  format: 'auto', // Will use PIXU for best compression
});
```

### Format with Fallback

```typescript
const result = await compress(file, {
  format: 'image/webp', // Falls back to JPEG if not supported
});
```


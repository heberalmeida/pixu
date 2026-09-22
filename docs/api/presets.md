# Presets

Named option packs for common delivery targets.

## Signature

```typescript
type CompressionPreset = 'social-media' | 'print' | 'web' | 'thumbnail' | 'email'

function getPresetOptions(preset: CompressionPreset): CompressionOptions
function applyPreset(
  options: CompressionOptions,
  preset: CompressionPreset
): CompressionOptions
```

## Preset table

| Preset | Typical max edge | Quality | Format |
|--------|------------------|---------|--------|
| `web` | 1920 | ~0.78 | PIXU |
| `social-media` | 1080 | ~0.82 | PIXU |
| `thumbnail` | 320 | ~0.70 | PIXU |
| `email` | 800 | ~0.72 | JPEG |
| `print` | 3000 | ~0.92 | JPEG |

Exact values live in `getPresetOptions`. User-provided fields in `applyPreset` override the preset (including `quality` when set).

## Examples

```typescript
import { compress, getPresetOptions, applyPreset } from 'pixu'

// Use a preset as-is
await compress(file, getPresetOptions('web'))

// Merge
await compress(file, applyPreset({ watermark: { text: 'Pixu' } }, 'social-media'))

// Via compress options
await compress(file, { preset: 'thumbnail' })
```

## Related

- Guide: [Compression presets](/guide/features/presets)
- [CompressionOptions.preset](/api/types#compressionoptions)

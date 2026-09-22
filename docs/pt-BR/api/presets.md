# Presets

Pacotes de opções nomeados para destinos comuns de entrega.

## Assinatura

```typescript
type CompressionPreset = 'social-media' | 'print' | 'web' | 'thumbnail' | 'email'

function getPresetOptions(preset: CompressionPreset): CompressionOptions
function applyPreset(
  options: CompressionOptions,
  preset: CompressionPreset
): CompressionOptions
```

## Tabela de presets

| Preset | Typical max edge | Quality | Format |
|--------|------------------|---------|--------|
| `web` | 1920 | ~0.78 | PIXU |
| `social-media` | 1080 | ~0.82 | PIXU |
| `thumbnail` | 320 | ~0.70 | PIXU |
| `email` | 800 | ~0.72 | JPEG |
| `print` | 3000 | ~0.92 | JPEG |

Exact values live in `getPresetOptions`. User-provided fields in `applyPreset` override the preset (including `quality` when set).

## Exemplos

```typescript
import { compress, getPresetOptions, applyPreset } from '@pantanal/pixu'

// Use a preset as-is
await compress(file, getPresetOptions('web'))

// Merge
await compress(file, applyPreset({ watermark: { text: 'Pixu' } }, 'social-media'))

// Via compress options
await compress(file, { preset: 'thumbnail' })
```

## Relacionado

- Guide: [Compression presets](/pt-BR/guide/features/presets)
- [CompressionOptions.preset](/pt-BR/api/types#compressionoptions)

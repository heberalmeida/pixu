# Encode PIXU — saída WebP/JPEG nativa

`format: 'image/pixu'` seleciona o caminho TECR. O **arquivo resultante é sempre** `image/webp` ou `image/jpeg` com extensão `.webp` / `.jpg` — pronto para `<img>`, download e CDN.

## Demo ao vivo

<CompressionDemo
  :options="{ format: 'image/pixu', enableSmartQuality: true, stripMetadata: true, quality: 0.85 }"
  title="Encode PIXU"
  subtitle="Caminho TECR — download em .webp ou .jpg"
/>

## Como funciona

| Etapa | O que acontece |
|-------|----------------|
| Encode | `compress(..., { format: 'image/pixu' })` usa qualidade adaptativa / smart |
| Resultado | `result.format` é `image/webp` ou `image/jpeg` |
| Exibir | `URL.createObjectURL(result.file)` funciona em `<img>` |
| Salvar | `buildDownloadName(name, result.format)` → `.webp` ou `.jpg` |

```typescript
import {
  compress,
  buildDownloadName,
  PIXU_MIME_TYPE,
} from '@pantanal/pixu'

const result = await compress(file, {
  format: PIXU_MIME_TYPE,
  enableSmartQuality: true,
})

img.src = URL.createObjectURL(result.file)

const a = document.createElement('a')
a.href = URL.createObjectURL(result.file)
a.download = buildDownloadName('photo', result.format)
a.click()
```

## Helpers legados

Se ainda houver um blob tipado como `image/pixu` (builds antigos), estes helpers remapeiam o payload para exibição:

| Helper | Papel |
|--------|-------|
| `createPreviewObjectURL(file, format?)` | Object URL seguro para `<img>` |
| `pixuToDisplayBlob(file)` | Mesmos bytes, MIME do browser |
| `loadPixuImage(file)` | `HTMLImageElement` decodificado |
| `detectPixuPayloadMime(buffer)` | Detecta payload WebP vs JPEG |

Compressões novas não precisam disso para preview ou download.

## Relacionado

- [Formato PIXU](/pt-BR/guide/features/pixu-format)
- [API: PIXU](/pt-BR/api/pixu-format)
- [TECR](/pt-BR/guide/theory/contextual-reconstructive-entropy)

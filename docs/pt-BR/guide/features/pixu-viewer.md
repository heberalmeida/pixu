# Visualizar imagens PIXU

Navegadores **não** renderizam `image/pixu` de forma nativa. Arquivos PIXU são payloads reconstrutivos (bytes WebP ou JPEG com MIME Pixu). O Pixu expõe helpers para **pré-visualizar** em `<img>`, canvas ou CSS e ainda **salvar** o blob `.pixu` original.

## Viewer ao vivo

Comprima em PIXU, veja no browser e baixe `.pixu`:

<CompressionDemo
  :options="{ format: 'image/pixu', enableSmartQuality: true, stripMetadata: true, quality: 0.85 }"
  title="Viewer PIXU"
  subtitle="A prévia usa createPreviewObjectURL — o download mantém .pixu"
/>

## Como funciona

| Etapa | O que acontece |
|-------|----------------|
| Encode | `compress(..., { format: 'image/pixu' })` → `File` com type `image/pixu` |
| Preview | `createPreviewObjectURL(file)` remapeia o MIME do payload para `image/webp` ou `image/jpeg` no `<img>` |
| Salvar | Mantenha `result.file` e nomeie com `buildDownloadName(name, result.format)` → `.pixu` |

```typescript
import {
  compress,
  createPreviewObjectURL,
  pixuToDisplayBlob,
  loadPixuImage,
  buildDownloadName,
  PIXU_MIME_TYPE,
} from 'pixu'

const result = await compress(file, {
  format: PIXU_MIME_TYPE,
  enableSmartQuality: true,
})

const previewUrl = await createPreviewObjectURL(result.file, result.format)
img.src = previewUrl

const displayBlob = await pixuToDisplayBlob(result.file)
const image = await loadPixuImage(result.file)

const a = document.createElement('a')
a.href = URL.createObjectURL(result.file)
a.download = buildDownloadName('photo', result.format) // photo.pixu
a.click()
```

## API

| Helper | Função |
|--------|--------|
| `createPreviewObjectURL(file, format?)` | Object URL seguro para `<img>` |
| `pixuToDisplayBlob(file)` | Mesmos bytes, MIME do browser |
| `createPixuObjectURL(file)` | URL de display focada em PIXU |
| `loadPixuImage(file)` | `HTMLImageElement` decodificado |
| `detectPixuPayloadMime(buffer)` | Detecta WebP vs JPEG |
| `isPixuBlob(file)` | Checagem de MIME |

## Suporte nativo?

Ainda não há codec nativo de browser para `image/pixu`. A visualização passa pelo Pixu (ou pelo seu próprio remap do payload). Para entregar `.pixu` a usuários finais, em geral:

1. Decode no cliente com esses helpers, ou
2. Transcode para WebP/JPEG no servidor para CDN pública, mantendo `.pixu` como formato de app/arquivo.

## Relacionado

- [Formato PIXU](/pt-BR/guide/features/pixu-format)
- [API: PIXU](/pt-BR/api/pixu-format)
- [TECR](/pt-BR/guide/theory/contextual-reconstructive-entropy)

# Exemplos Jacaré

Mesmo layout da documentação deste site. Demo ao vivo de `compress()` abaixo; playground `.jcr` em `examples/jacare/`.

## Demo ao vivo

<JacareDemo :options="{ format: 'image/pixu', enableSmartQuality: true }" />

## Executar o projeto

```bash
npm run build
cd examples/jacare && npm install && npm run dev
```

Abra `http://localhost:3003` — usa `components/jacare/PixuCompressor.jcr`.

## Componente

```javascript
import PixuCompressor from 'pixu/components/jacare/PixuCompressor.jcr'

export <view>
  <PixuCompressor
    :options=${{ format: 'image/pixu', enableSmartQuality: true }}
    :samples=${samples}
    on-compress=${onCompress}
  />
</view>
```

[Guia do componente Jacaré →](/pt-BR/guide/components/jacare)

## Stack

| Pacote | Função |
|---------|------|
| `@jacare/core` | Signals (`pulse`, `derive`), bindings de DOM |
| `@jacare/vite-plugin` | Compila templates `.jcr` no build |
| `pixu` | `compress`, `buildDownloadName` |

## Importar o Pixu

```javascript
import { pulse, derive } from '@jacare/core'
import { compress, buildDownloadName } from '@pantanal/pixu'

const quality = pulse(0.85)
const format = pulse('image/pixu')

async function onFileChange(e) {
  const file = e.target.files?.[0]
  if (!file) return

  const result = await compress(file, {
    quality: quality(),
    format: format(),
    stripMetadata: true,
    enableSmartQuality: true,
    onProgress: (p) => progress.set(p),
  })

  console.log(result.compressionRatio)
  console.log(buildDownloadName('out', 'image/webp')) // "out.webp"
}
```

## Template (`.jcr`)

```javascript
export <view>
  <main>
    <img src="/logo.png" alt="Pixu" />
    <input type="file" accept="image/*" on-change=${onFileChange} />
    <select bind-value=${format}>
      <option value="auto">Auto (prefers PIX)</option>
      <option value="image/jpeg">JPEG</option>
      <option value="image/webp">WebP</option>
      <option value="image/pixu">PIXU (Best)</option>
    </select>
    #if result()
      <button type="button" on-click=${downloadCompressed}>Download</button>
    #end
  </main>
</view>
```

## Imagens de exemplo

A demo inclui uma galeria de fotos reais em `public/`:

- `photo-landscape.jpg`, `photo-portrait.jpg`, `photo-city.jpg`
- `photo-nature.jpg`, `photo-food.jpg`, `graphic-transparent.png`

Clique em qualquer amostra para comprimir na hora — sem precisar fazer upload.

## Tema da marca

Roxo `#7b3fef` e ciano `#00ccff` da logo Pixu. Estilos compartilhados: `examples/shared/theme.css`.

## Estrutura do projeto

```
examples/jacare/
  src/
    app.jcr      # UI + compression logic
    app.css      # Theme imports
    boot.js      # Mount entry
  public/        # logo + sample images
  vite.config.js # pixu alias + jacare plugin
  package.json
```

## Validar templates

```bash
npm run check
```

## Aprender Jacaré

- [Jacaré GitHub](https://github.com/jacarejs/core)
- [Jacaré Lab tutorial](https://jacarejs.github.io/core/lab/)
- [API reference](https://github.com/jacarejs/core/blob/main/docs/api.md)

## Veja também

- [Todos os exemplos de frameworks](/pt-BR/examples/)
- [Formato PIXU](/pt-BR/guide/features/pixu-format)
- [API: compress()](/pt-BR/api/compress)

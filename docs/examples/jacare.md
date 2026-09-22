# Jacaré Examples

Same documentation layout as this site. Live `compress()` demo below; `.jcr` playground in `examples/jacare/`.

## Live demo

<JacareDemo :options="{ format: 'image/pixu', enableSmartQuality: true }" />

## Run the project

```bash
npm run build
cd examples/jacare && npm install && npm run dev
```

Open `http://localhost:3003` — uses `components/jacare/PixuCompressor.jcr`.

## Component

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

[Jacaré component guide →](/guide/components/jacare)

## Stack

| Package | Role |
|---------|------|
| `@jacare/core` | Signals (`pulse`, `derive`), DOM bindings |
| `@jacare/vite-plugin` | Compiles `.jcr` templates at build time |
| `pixu` | `compress`, `buildDownloadName` |

## Import Pixu

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

## Sample images

The demo includes a gallery of real photos in `public/`:

- `photo-landscape.jpg`, `photo-portrait.jpg`, `photo-city.jpg`
- `photo-nature.jpg`, `photo-food.jpg`, `graphic-transparent.png`

Click any sample to compress immediately — no upload required.

## Brand theme

Purple `#7b3fef` and cyan `#00ccff` from the Pixu logo. Shared styles: `examples/shared/theme.css`.

## Project layout

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

## Validate templates

```bash
npm run check
```

## Learn Jacaré

- [Jacaré GitHub](https://github.com/jacarejs/core)
- [Jacaré Lab tutorial](https://jacarejs.github.io/core/lab/)
- [API reference](https://github.com/jacarejs/core/blob/main/docs/api.md)

## See also

- [All framework examples](/examples/)
- [PIXU Format](/guide/features/pixu-format)
- [API: compress()](/api/compress)

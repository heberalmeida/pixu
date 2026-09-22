# Jacaré Component

Use Pixu with [Jacaré](https://github.com/jacarejs/core) via a reusable `.jcr` component — fine-grained reactivity, no Virtual DOM.

## Live demo

<JacareDemo :options="{ format: 'image/pixu', enableSmartQuality: true }" />

## Installation

```bash
npm install @pantanal/pixu @jacare/core
```

Use `@jacare/vite-plugin` (or the Jacaré CLI) so `.jcr` files compile.

## Basic usage

```javascript
import PixuCompressor from 'pixu/components/jacare/PixuCompressor.jcr'

const options = {
  format: 'image/pixu',
  enableSmartQuality: true,
  quality: 0.85,
}

function onCompress(result) {
  console.log('Compressed:', result)
}

function onError(error) {
  console.error(error)
}

export <view>
  <PixuCompressor
    :instanceId=${'demo'}
    :options=${options}
    on-compress=${onCompress}
    on-error=${onError}
  />
</view>
```

## Props

### options

Type: `CompressionOptions` (object)

Compression options. See [CompressionOptions](/api/types#compressionoptions).

```javascript
const options = {
  format: 'image/pixu',
  enableSmartQuality: true,
  maxWidth: 1920,
  maxHeight: 1080,
  stripMetadata: true,
}
```

### samples

Type: `{ id: string; label: string; url: string; file: string }[]`

Optional sample thumbnails inside the upload area.

```javascript
const samples = [
  { id: 'landscape', label: 'Mountains', url: '/photo-landscape.jpg', file: 'photo-landscape.jpg' },
]

export <view>
  <PixuCompressor :options=${options} :samples=${samples} />
</view>
```

### autoCompress

Type: `boolean` · Default: `true`

When `false`, selecting a file only previews it (no compress until you wire your own flow).

### instanceId

Type: `string` · Default: `'default'`

Unique id per mounted compressor. Required when several `PixuCompressor` instances share a page so each keeps its own file/result state.

## Emits

| Event | Payload | When |
|-------|---------|------|
| `compress` | `CompressionResult` | Compression succeeded |
| `error` | `Error` | Compression failed |
| `progress` | `number` (0–1) | Progress updates |

```javascript
<PixuCompressor
  :options=${options}
  on-compress=${onCompress}
  on-error=${onError}
  on-progress=${onProgress}
/>
```

## Contract

The component declares a Jacaré template contract:

```javascript
export <contract>
  props: {
    options: { type: 'object', default: {} }
    samples: { type: 'any', default: [] }
    autoCompress: { type: 'boolean', default: true }
  }
  emits: ['compress', 'error', 'progress']
</contract>
```

## Complete example

```bash
npm run build
cd examples/jacare && npm install && npm run dev
```

`http://localhost:3003` — uses `components/jacare/PixuCompressor.jcr`.

[Jacaré framework example →](/examples/jacare)

## Import path

```javascript
import PixuCompressor from 'pixu/components/jacare/PixuCompressor.jcr'
```

Or relative from your app:

```javascript
import PixuCompressor from '../../../components/jacare/PixuCompressor.jcr'
```

## Best compression

```javascript
const options = {
  format: 'image/pixu',
  enableSmartQuality: true,
  stripMetadata: true,
}
```

See [PIXU Format](/guide/features/pixu-format) and [TECR](/guide/theory/contextual-reconstructive-entropy).

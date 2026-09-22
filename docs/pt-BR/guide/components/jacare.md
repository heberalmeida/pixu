# Componente Jacaré

Use o Pixu com [Jacaré](https://github.com/jacarejs/core) via um componente `.jcr` reutilizável — reatividade fina, sem Virtual DOM.

## Demo ao vivo

<JacareDemo :options="{ format: 'image/pixu', enableSmartQuality: true }" />

## Instalação

```bash
npm install pixu @jacare/core
```

Use `@jacare/vite-plugin` (ou a CLI do Jacaré) para compilar arquivos `.jcr`.

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
    :options=${options}
    on-compress=${onCompress}
    on-error=${onError}
  />
</view>
```

## Props

### options

Type: `CompressionOptions` (object)

Opções de compressão. Veja [CompressionOptions](/pt-BR/api/types#compressionoptions).

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

Miniaturas de exemplo opcionais na área de upload.

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

Quando `false`, selecionar um arquivo só gera preview (sem comprimir até você conectar o fluxo).

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

## Contrato

O componente declara um contrato de template Jacaré:

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

## Exemplo completo

```bash
npm run build
cd examples/jacare && npm install && npm run dev
```

`http://localhost:3003` — uses `components/jacare/PixuCompressor.jcr`.

[Exemplo Jacaré →](/pt-BR/examples/jacare)

## Caminho de importação

```javascript
import PixuCompressor from 'pixu/components/jacare/PixuCompressor.jcr'
```

Ou caminho relativo a partir do seu app:

```javascript
import PixuCompressor from '../../../components/jacare/PixuCompressor.jcr'
```

## Melhor compressão

```javascript
const options = {
  format: 'image/pixu',
  enableSmartQuality: true,
  stripMetadata: true,
}
```

See [Formato PIXU](/pt-BR/guide/features/pixu-format) and [TECR](/pt-BR/guide/theory/contextual-reconstructive-entropy).

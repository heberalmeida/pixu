# PixuCompressor

Compressor baseado em classe com abort, hooks de plugin e isolamento de instância.

## Assinatura

```typescript
class PixuCompressor {
  constructor()
  compress(file: File | Blob, options?: CompressionOptions): Promise<CompressionResult>
  abort(): void
  registerPlugin(plugin: Plugin): void
  unregisterPlugin(name: string): void
}
```

The module function [`compress`](/pt-BR/api/compress) uses one shared instance. Create your own when you need concurrent compressors or abort control.

## Métodos

### `compress(file, options?)`

Same contract as [`compress()`](/pt-BR/api/compress). Throws if this instance is already compressing, or after `abort()`.

### `abort()`

Cancels the in-flight job for this instance. The pending promise rejects with a compression-aborted error.

### `registerPlugin(plugin)` / `unregisterPlugin(name)`

Attach lifecycle hooks. See [Plugins](/pt-BR/api/plugins).

## Export default

```typescript
import pixu from 'pixu'
// pixu instanceof PixuCompressor — shared singleton
await pixu.compress(file)
```

## Exemplos

### Abort on navigation

```typescript
import { PixuCompressor } from 'pixu'

const compressor = new PixuCompressor()

async function start(file: File) {
  try {
    return await compressor.compress(file, {
      quality: 0.85,
      format: 'image/pixu',
      onProgress: (p) => setProgress(p),
    })
  } catch (e) {
    if (e instanceof Error && /abort/i.test(e.message)) return null
    throw e
  }
}

function onRouteChange() {
  compressor.abort()
}
```

### Isolated parallel work

```typescript
const a = new PixuCompressor()
const b = new PixuCompressor()

const [r1, r2] = await Promise.all([
  a.compress(file1, { quality: 0.8 }),
  b.compress(file2, { quality: 0.8 }),
])
```

## Relacionado

- [Plugins](/pt-BR/api/plugins)
- [compressBatch](/pt-BR/api/compress-batch)

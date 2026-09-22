# Plugins

Estende a compressão com hooks before/after e transforms no canvas.

## Formato do plugin

```typescript
interface Plugin {
  name: string
  version: string
  beforeCompress?: (
    file: File | Blob,
    options: CompressionOptions
  ) => Promise<File | Blob> | File | Blob
  afterCompress?: (
    result: CompressionResult,
    options: CompressionOptions
  ) => Promise<CompressionResult> | CompressionResult
  transform?: (
    canvas: HTMLCanvasElement,
    options: CompressionOptions
  ) => Promise<void> | void
}
```

Hooks run in registration order. `beforeCompress` / `afterCompress` chain their return values.

## PluginManager

```typescript
class PluginManager {
  register(plugin: Plugin): void
  unregister(name: string): void
  runBeforeCompress(file, options): Promise<File | Blob>
  runAfterCompress(result, options): Promise<CompressionResult>
  runTransform(canvas, options): Promise<void>
  getPlugin(name: string): Plugin | undefined
  getAllPlugins(): Plugin[]
}
```

Prefer registering through [`PixuCompressor`](/pt-BR/api/pixu-compressor):

```typescript
import { PixuCompressor, type Plugin } from 'pixu'

const stamp: Plugin = {
  name: 'stamp',
  version: '1.0.0',
  transform(canvas) {
    const ctx = canvas.getContext('2d')!
    ctx.fillStyle = 'rgba(0,0,0,0.5)'
    ctx.fillText('draft', 16, 32)
  },
}

const compressor = new PixuCompressor()
compressor.registerPlugin(stamp)
await compressor.compress(file, { quality: 0.8 })
compressor.unregisterPlugin('stamp')
```

## Relacionado

- [PixuCompressor](/pt-BR/api/pixu-compressor)
- [Types → Plugin](/pt-BR/api/types#plugin)

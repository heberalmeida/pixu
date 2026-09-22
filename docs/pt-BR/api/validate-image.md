# validateImage

Valida uma imagem antes da compressão — formato, dimensões e integridade básica.

## Assinatura

```typescript
function validateImage(file: File | Blob): Promise<ImageValidationResult>

function isValidImage(file: File | Blob): Promise<boolean>
```

## Parâmetros

### `file`

`File | Blob` — candidate image.

## Retorno

### `ImageValidationResult`

```typescript
interface ImageValidationResult {
  isValid: boolean
  errors: string[]
  warnings: string[]
  actualFormat?: string
  declaredFormat?: string
  dimensions?: { width: number; height: number }
  fileSize?: number
}
```

| Field | Description |
|-------|-------------|
| `isValid` | `true` when there are no hard errors |
| `errors` | Blocking issues (corrupt, not an image, …) |
| `warnings` | Soft issues (MIME mismatch, huge dimensions, …) |
| `actualFormat` | Detected MIME / codec |
| `declaredFormat` | `file.type` when available |
| `dimensions` | Natural width/height when decodable |
| `fileSize` | Byte length |

`isValidImage(file)` is equivalent to `(await validateImage(file)).isValid`.

## Exemplos

### Gate compression

```typescript
import { validateImage, compress } from '@pantanal/pixu'

const validation = await validateImage(file)

if (!validation.isValid) {
  throw new Error(validation.errors.join('; '))
}

for (const warning of validation.warnings) {
  console.warn(warning)
}

const result = await compress(file, { quality: 0.8 })
```

### Shorthand

```typescript
import { isValidImage, compress } from '@pantanal/pixu'

if (await isValidImage(file)) {
  await compress(file)
}
```

### Via compress options

```typescript
await compress(file, {
  validateImage: true,
  quality: 0.8,
})
```

## Relacionado

- [analyzeImage](/pt-BR/api/analyze-image) — content recommendations
- [compress](/pt-BR/api/compress)

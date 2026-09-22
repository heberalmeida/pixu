# validateImage

Valida um arquivo de imagem antes da compressão.

## Assinatura

```typescript
function validateImage(
  file: File | Blob
): Promise<ImageValidationResult>
```

## Parâmetros

### file

Tipo: `File | Blob`

O arquivo de imagem a validar.

## Retorno

Tipo: `Promise<ImageValidationResult>`

Resultado da validação com:
- `isValid: boolean`
- `errors: string[]`
- `warnings: string[]`
- `actualFormat?: string`
- `declaredFormat?: string`
- `dimensions?: { width: number; height: number }`
- `fileSize?: number`

## Exemplo

```typescript
import { validateImage } from 'pixu';

const validation = await validateImage(file);

if (validation.isValid) {
  console.log('Image is valid');
  console.log('Dimensions:', validation.dimensions);
  console.log('Format:', validation.actualFormat);
} else {
  console.error('Validation errors:', validation.errors);
}

if (validation.warnings.length > 0) {
  console.warn('Warnings:', validation.warnings);
}
```

## Atalho

```typescript
import { isValidImage } from 'pixu';

const isValid = await isValidImage(file);
if (isValid) {
  const result = await compress(file);
}
```

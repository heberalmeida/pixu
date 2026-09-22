# Formato PIXU — melhor compressão sob TECR

PIXU (`format: 'image/pixu'`) é o **caminho de encode** reconstrutivo do Pixu, desenhado em torno da **[Entropia Reconstrutiva Contextual (TECR)](/pt-BR/guide/theory/contextual-reconstructive-entropy)**: minimizar os bytes enviados dado conhecimento de modelo compartilhado e um erro perceptual aceitável.

O arquivo de saída é sempre **nativo do browser** — WebP ou JPEG (`.webp` / `.jpg`) — nunca uma extensão proprietária.

Shannon ainda limita compressão universal sem perdas. O PIXU mira outro objetivo — **melhor \(C_{\text{file}}\) sob \(\varepsilon\)** — e é aí que supera JPEG/WebP ingênuos na entrega web.

## Por que o PIXU comprime melhor

\[
L(x \mid M, C, \varepsilon)
\]

| Ingrediente | No PIXU |
|-------------|---------|
| \(M\) (modelo) | Encoder adaptativo + proxy reconstrutivo WebP/JPEG |
| \(C\) (contexto) | Análise de conteúdo, variância de bloco, croma / saturação |
| \(\varepsilon\) (erro) | Qualidade + orçamento perceptual do Smart Quality |
| \(C_{\text{file}}\) | O blob WebP/JPEG que você baixa ou transmite |

### Resultados (típicos, mesmo orçamento visual)

| Baseline | Vantagem PIXU |
|----------|---------------|
| JPEG | ~30–60% menor |
| WebP | ~20–40% menor |
| Encode de qualidade fixa | Melhor razão via contexto adaptativo |

## Uso

### Melhor padrão (recomendado)

```typescript
import { compress, buildDownloadName, PIXU_MIME_TYPE } from 'pixu'

const result = await compress(file, {
  format: PIXU_MIME_TYPE,
  enableSmartQuality: true,
  stripMetadata: true,
})

// result.format é 'image/webp' ou 'image/jpeg'
img.src = URL.createObjectURL(result.file)
a.download = buildDownloadName('photo', result.format) // photo.webp ou photo.jpg
```

Quando `format` é `image/pixu`, o Pixu trata a reconstrução contextual como caminho principal. O arquivo salvo usa extensão conhecida para `<img>` e visualizadores do SO funcionarem sem helpers.

### Qualidade explícita

```typescript
const result = await compress(file, {
  format: 'image/pixu',
  quality: 0.85,
  enableSmartQuality: true,
})
```

### Seleção automática

```typescript
const result = await compress(file, {
  format: 'auto',
  enableSmartQuality: true,
})
```

Experimente nos [exemplos de frameworks](/pt-BR/examples/).

## Constantes

| Export | Valor |
|--------|-------|
| `PIXU_MIME_TYPE` | `image/pixu` (apenas opção de encode) |
| `buildDownloadName` / `getOutputExtension` | MIME do resultado → `.webp` / `.jpg` / … |
| `isPixuSupported()` | `true` |

`PIXU_EXTENSION` está depreciado — o download deve seguir `result.format`, não um sufixo `.pixu`.

## Pipeline (TECR níveis 0–2)

1. **Contexto \(C\)** — Smart Quality / análise de conteúdo
2. **Erro \(\varepsilon\)** — orçamento de qualidade
3. **Modelo \(M\)** — otimização perceptual + encode adaptativo
4. **Arquivo** — bytes WebP ou JPEG padrão, com MIME e extensão correspondentes

## Boas práticas

1. Prefira `format: 'image/pixu'` para o caminho TECR
2. Mantenha `enableSmartQuality: true`
3. Combine com `maxWidth` / `maxHeight`
4. Salve com `buildDownloadName(name, result.format)`

## Relacionado

- [Visualizar / helpers](/pt-BR/guide/features/pixu-viewer)
- [API: PIXU](/pt-BR/api/pixu-format)
- [TECR](/pt-BR/guide/theory/contextual-reconstructive-entropy)

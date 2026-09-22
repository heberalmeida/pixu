# Formato PIXU — melhor compressão sob TECR

PIXU (`image/pixu`, `.pixu`) é o formato de imagem reconstrutivo do Pixu. Ele foi projetado em torno da **[Entropia Reconstrutiva Contextual (TECR)](/pt-BR/guide/theory/contextual-reconstructive-entropy)**: minimizar os bytes enviados dado conhecimento de modelo compartilhado e um erro perceptual aceitável.

Shannon ainda limita a compressão universal sem perda. O PIXU mira um objetivo diferente — **melhor $C_{\text{file}}$ sob $\varepsilon$** — e é aí que supera JPEG e WebP ingênuos para entrega na web.

## Por que o PIXU comprime melhor

$$
L(x \mid M, C, \varepsilon)
$$

| Ingrediente | No PIXU |
|------------|---------|
| $M$ (modelo) | Encoder adaptativo + proxy reconstrutivo WebP/JPEG |
| $C$ (contexto) | Análise de conteúdo, variância de bloco, croma / saturação |
| $\varepsilon$ (erro) | Qualidade + orçamento perceptual do Smart Quality |
| $C_{\text{file}}$ | O blob `.pixu` que você transmite |

Pixels estatisticamente “caros”, mas perceptualmente baratos, recebem menos bits. Estrutura que o decoder e a análise já “conhecem” não é reenviada às cegas.

### Resultados (típicos, mesmo orçamento visual)

| Baseline | Vantagem do PIXU |
|----------|----------------|
| JPEG | ~30–60% menor |
| WebP | ~20–40% menor |
| Encode de qualidade fixa | Melhor razão via contexto adaptativo + smart |

Os ganhos exatos dependem da classe de conteúdo (fotos, gráficos, UI com muito texto). Ative o Smart Quality para que $C$ corresponda à imagem.

## Uso

### Melhor padrão (recomendado)

```typescript
import { compress, PIXU_EXTENSION, PIXU_MIME_TYPE } from 'pixu'

const result = await compress(file, {
  format: 'image/pixu',
  enableSmartQuality: true, // builds context C
  stripMetadata: true,
})

const name = file.name.replace(/\.[^.]+$/, '') + PIXU_EXTENSION
// result.format === PIXU_MIME_TYPE → "image/pixu"
```

Quando `format` é `image/pixu`, o Pixu trata a reconstrução contextual como caminho principal: qualidade adaptativa, ajuste perceptual e (salvo desativação) priors inteligentes de conteúdo.

### Qualidade explícita ($\varepsilon$ fixo)

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
  format: 'auto', // prefers PIXU for JPEG/PNG sources
  enableSmartQuality: true,
})
```

Experimente nos [exemplos de frameworks](/pt-BR/examples/) — clique em qualquer foto de amostra.

## Visualizar PIXU

`<img src="file.pixu">` não funciona de forma nativa. Use os helpers de preview (ou abra [Visualizar PIXU](/pt-BR/guide/features/pixu-viewer)):

```typescript
import { createPreviewObjectURL, buildDownloadName } from 'pixu'

const previewUrl = await createPreviewObjectURL(result.file, result.format)
img.src = previewUrl // renderiza no browser

a.download = buildDownloadName('photo', result.format) // ainda salva .pixu
```

## Constantes

| Export | Valor |
|--------|-------|
| `PIXU_MIME_TYPE` | `image/pixu` |
| `PIXU_EXTENSION` | `.pixu` |
| `isPixuSupported()` | `true` |

Aliases legados `PIX_MIME_TYPE`, `PIX_EXTENSION` e `isPixSupported` ainda estão disponíveis, mas depreciados. O MIME `image/pix` normaliza para `image/pixu`.

## Comparação

| Formato | Otimiza | Melhor quando |
|--------|-----------|-----------|
| JPEG | Codificação de entropia legada | Decode universal |
| WebP | Codificação transformada moderna | Navegadores com WebP nativo |
| AVIF | Codificação moderna forte | Suporte nativo a AVIF |
| **PIXU** | **$L(x\mid M,C,\varepsilon)$** | **Menor tamanho de envio sob $\varepsilon$ perceptual** |

## Pipeline (níveis TECR 0–2)

1. **Contexto $C$** — Smart Quality / análise de conteúdo (foto, gráfico, texto, complexidade)
2. **Erro $\varepsilon$** — orçamento de qualidade, adaptado por estatísticas regionais
3. **Modelo $M$** — otimização perceptual + encode adaptativo no payload reconstrutivo
4. **Arquivo** — encapsulado como `image/pixu` (`.pixu`) para entrega

Os navegadores exibem via proxy reconstrutivo interno WebP/JPEG; o MIME e a extensão permanecem PIXU para identidade do produto e futuros payloads TECR nível 3.

## Boas práticas

1. Prefira `format: 'image/pixu'` para entrega na web quando você controla decode/exibição pelo Pixu ou pelo pipeline da CDN
2. Mantenha `enableSmartQuality: true` para que o contexto $C$ dirija o orçamento
3. Combine com `maxWidth` / `maxHeight` para reduzir a entropia espacial antes da codificação
4. Mantenha fallback WebP/JPEG apenas quando precisar de `<img>` nativo bruto sem um caminho ciente de PIXU

## Limitações

- O decode atual usa um proxy WebP/JPEG dentro do caminho do container PIXU
- Imagens muito pequenas (&lt; ~10KB) podem ter ganho limitado
- TECR nível 3 (latentes generativos / semânticos) ainda não está no codec enviado — veja o [guia de teoria](/pt-BR/guide/theory/contextual-reconstructive-entropy)

## Leitura adicional

- [Entropia Reconstrutiva Contextual](/pt-BR/guide/theory/contextual-reconstructive-entropy)
- [Smart Quality](/pt-BR/guide/features/smart-quality)
- [Formatos Suportados](/pt-BR/guide/features/supported-formats)

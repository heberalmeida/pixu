# Smart Quality — contexto de conteúdo $C$

O Smart Quality constrói o termo de **contexto** no modelo de [Entropia Reconstrutiva Contextual](/pt-BR/guide/theory/contextual-reconstructive-entropy) do Pixu:

$$
L(x \mid M, C, \varepsilon)
$$

Em vez de uma qualidade fixa para cada imagem, o Pixu estima a classe de conteúdo e a complexidade, e então define um orçamento de erro perceptual $\varepsilon$ que favorece um $C_{\text{file}}$ menor sem gastar bits em detalhes que o olho não perceberá.

## Uso básico

<CompressionDemo :options="{ enableSmartQuality: true, format: 'image/pixu' }" />

```typescript
const result = await compress(file, {
  format: 'image/pixu',
  enableSmartQuality: true,
})
```

Para saída PIXU, a reconstrução contextual é o caminho padrão: mantenha o Smart Quality ativo, a menos que você precise apenas de uma qualidade numérica fixa.

## Como funciona

A análise estima:

| Sinal | Usado como |
|--------|---------|
| Tipo de conteúdo (foto / gráfico / texto / misto) | Prior para $C$ |
| Complexidade (baixa / média / alta) | Quão agressivamente gastar $\varepsilon$ |
| Qualidade recomendada | $\varepsilon$ inicial para o encoder |

Esse contexto alimenta a codificação PIXU adaptativa ($M$), de modo que a taxa de bits acompanhe a estrutura, e não uma constante cega.

## Priors de conteúdo

### Fotos

Cenas naturais toleram mais perda perceptual → qualidade recomendada mais baixa (mais compressão).

### Gráficos

Cores chapadas e bordas nítidas precisam de qualidade mais alta para evitar banding e ringing.

### Texto

Imagens com muitas bordas e baixa diversidade mantêm qualidade alta para legibilidade.

## Com PIXU (recomendado)

```typescript
import { compress } from '@pantanal/pixu'

const result = await compress(file, {
  format: 'image/pixu',
  enableSmartQuality: true,
  stripMetadata: true,
})
```

Esta é a receita TECR de “melhor compressão”: modelo reconstrutivo compartilhado + contexto medido + $\varepsilon$ perceptual.

## Sobrescrevendo o orçamento

```typescript
const result = await compress(file, {
  enableSmartQuality: true,
  quality: 0.85, // explicit ε; context still informs PIXU adaptive stages
})
```

## Análise manual

```typescript
import { analyzeImageContent } from '@pantanal/pixu'

const canvas = document.createElement('canvas')
const ctx = canvas.getContext('2d')
ctx.drawImage(img, 0, 0)

const analysis = await analyzeImageContent(canvas)
console.log(analysis.recommendedQuality)
console.log(analysis.complexity, analysis.isPhoto, analysis.isGraphic)
```

## Exemplo

```typescript
import { compress } from '@pantanal/pixu'

async function smartCompress(file: File) {
  return compress(file, {
    format: 'image/pixu',
    enableSmartQuality: true,
  })
}
```

## Veja também

- [Teoria TECR](/pt-BR/guide/theory/contextual-reconstructive-entropy)
- [Formato PIXU](/pt-BR/guide/features/pixu-format)
- [Análise de Imagem](/pt-BR/guide/features/image-analysis)

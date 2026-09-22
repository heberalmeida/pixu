# Entropia Reconstrutiva Contextual (TECR)

O modelo de compressão do Pixu se fundamenta na **Entropia Reconstrutiva Contextual** — uma extensão prática da teoria clássica da informação para imagens na web.

Ele **não** reivindica quebrar o teorema de Shannon. Ele muda o problema que otimizamos: minimizar o que você *envia*, dado contexto compartilhado e um erro de reconstrução aceitável.

## Por que Shannon não é a história toda

O teorema de codificação de fonte de Shannon estabelece que, sob um modelo probabilístico fixo de uma fonte, você não pode comprimir de forma lossless *toda* mensagem abaixo da sua entropia média $H(X)$.

Esse limite vale quando:

- compressor e descompressor compartilham **nenhum** conhecimento extra além do codec;
- o objetivo é a recuperação **exata** ($x' = x$);
- “informação” significa apenas redundância estatística.

A entrega real de imagens viola essas premissas o tempo todo:

| Premissa clássica | Realidade web / Pixu |
|-------------------|--------------------|
| Recuperação bit a bit exata | Equivalência perceptual basta |
| Sem prior compartilhado | Codec + análise + heurísticas de domínio atuam como $M$ compartilhado |
| Só estatísticas de símbolos | Estrutura, bordas, saturação e classe de conteúdo importam |
| Custo = tamanho do bitstream | Custo = arquivo + modelo + contexto + erro permitido |

## Ideia central

> O tamanho mínimo necessário para representar um objeto depende não só dos dados em si, mas do **conhecimento compartilhado** e da **capacidade de reconstrução** do receptor.

Escrevemos o comprimento de descrição mais curto de $x$ sob modelo compartilhado $M$, contexto $C$ e orçamento de erro $\varepsilon$ como:

$$
L(x \mid M, C, \varepsilon)
$$

### Custo total de representação

$$
C_{\text{total}} = C_{\text{file}} + C_{\text{model}} + C_{\text{context}} + C_{\text{error}}
$$

| Termo | Significado no Pixu |
|------|-----------------|
| $C_{\text{file}}$ | Bytes no arquivo de saída (WebP/JPEG do caminho PIXU, ou outro) |
| $C_{\text{model}}$ | Codec + pipeline reconstrutivo do Pixu (proxy WebP/JPEG, encoder adaptativo) |
| $C_{\text{context}}$ | Análise de conteúdo: foto vs gráfico, complexidade, bordas, croma |
| $C_{\text{error}}$ | Distorção perceptual permitida $\varepsilon$ (quality / smart quality) |

Um método pode produzir arquivos **muito menores** do que a entropia estimada só nos pixels. Os bits que faltam não desapareceram — eles vivem em $M$ e $C$, ou foram gastos como $\varepsilon$.

## Níveis de TECR no Pixu

| Nível | Nome | O que o Pixu faz |
|-------|------|----------------|
| **0** | Contexto de sinal | Variância de bloco, saturação, qualidade sensível a croma |
| **1** | Contexto de conteúdo | Smart Quality: priors de foto / gráfico / texto |
| **2** | Contexto de formato | Caminho PIXU: encode adaptativo + $\varepsilon$ perceptual como cidadão de primeira classe |
| **3** *(roadmap)* | Semântico / generativo | $M$ generativo compartilhado; armazenar prompts ou latentes, não todos os pixels |

Os níveis 0–2 já estão disponíveis. O nível 3 é o horizonte de pesquisa (modelos versionados, contabilidade explícita de $C_{\text{model}}$).

## O que “melhor compressão” significa aqui

O Pixu otimiza para:

$$
\min \; C_{\text{file}} \quad \text{s.t.} \quad d(x, \hat{x}) \le \varepsilon
$$

em que $d$ é uma distorção **perceptual** (implícita em quality + ajuste sensível ao conteúdo), não igualdade bit a bit.

É por isso que o PIXU rotineiramente supera JPEG/WebP ingênuos no mesmo orçamento visual: ele gasta bits onde o olho se importa e toma emprestada estrutura de $C$ e $M$.

### Comparação honesta com Shannon

| Afirmação | Status |
|-------|--------|
| “Superamos Shannon de forma lossless em dados arbitrários” | **Falso** — impossível sob as premissas clássicas |
| “Superamos codecs ingênuos sob $\varepsilon$ perceptual + contexto” | **Verdadeiro** — esta é a reivindicação de produto do Pixu |
| “Codecs generativos futuros reescrevem $L(x\mid M,C,\varepsilon)$” | **Pesquisa** — TECR nível 3 |

## Mapeamento para a API

```typescript
import { compress } from 'pixu'

const result = await compress(file, {
  format: 'image/pixu',   // prefer reconstructive PIXU path (M)
  enableSmartQuality: true, // build C from image content
  quality: 0.85,          // ε budget when you fix it explicitly
  stripMetadata: true,    // drop context the receiver does not need
})
```

| Opção | Papel no TECR |
|--------|-----------|
| `format: 'image/pixu'` | Seleciona o modelo reconstrutivo $M$ |
| `enableSmartQuality` | Estima o contexto de conteúdo $C$ |
| `quality` / qualidade adaptativa | Define $\varepsilon$ |
| Dual-pass / tamanho alvo | Busca sobre $C_{\text{file}}$ sob $\varepsilon$ |

Veja também:

- [Formato PIXU](/pt-BR/guide/features/pixu-format) — formato que implementa TECR níveis 0–2
- [Smart Quality](/pt-BR/guide/features/smart-quality) — contexto de conteúdo $C$
- [Análise de imagem](/pt-BR/guide/features/image-analysis) — inspecionar $C$ explicitamente

## Checklist científico (para contribuidores)

Para aprofundar TECR como teoria — não marketing:

1. Definir informação, contexto, reconstrução e erro com rigor
2. Enunciar teoremas / limites para $L(x\mid M,C,\varepsilon)$
3. Provar ou limitar proposições formalmente
4. Publicar experimentos reproduzíveis (bitrate vs métricas perceptuais)
5. Sempre reportar $C_{\text{total}}$, nunca só $C_{\text{file}}$
6. Preferir previsões que codecs clássicos não explicam bem

A descoberta valiosa não é “Shannon estava errado.” É um **novo limite prático** para compressão de imagem contextual e reconstrutiva — a base do Pixu.

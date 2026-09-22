---
layout: home

hero:
  name: Pixu
  text: Melhor compressão sob TECR
  tagline: Entropia Reconstrutiva Contextual · formato PIXU · Zero dependências · TypeScript
  image:
    src: /logo.png
    alt: Pixu
  actions:
    - theme: brand
      text: Começar
      link: /pt-BR/guide/getting-started
    - theme: alt
      text: Teoria
      link: /pt-BR/guide/theory/contextual-reconstructive-entropy
    - theme: alt
      text: Experimentar demo ao vivo
      link: /pt-BR/demo

features:
  - title: Entropia Reconstrutiva Contextual
    details: Otimize $L(x|M,C,\varepsilon)$ — envie menos bytes com modelo compartilhado, contexto do conteúdo e erro perceptual. Shannon continua válido; o problema que resolvemos é melhor.
  - title: Formato PIXU
    details: Caminho reconstrutivo image/pixu — tipicamente 30–60% menor que JPEG e 20–40% vs WebP no mesmo orçamento visual.
  - title: Contexto inteligente (C)
    details: Smart Quality classifica foto, gráfico e texto para que a taxa de bits siga a estrutura, não uma constante cega.
  - title: Zero dependências
    details: Bundle leve (~14KB gzip). Sem dependências de runtime externas — envie menos, carregue mais rápido.
  - title: Pronto para frameworks
    details: Componentes prontos para Vue 3, React, Angular, Svelte e Jacaré com imagens de exemplo reais.
  - title: TypeScript completo
    details: API tipada, CompressionResult, SupportedFormat e export PIXU_EXTENSION.
---

## Início rápido

```bash
npm install pixu
```

```typescript
import { compress, PIXU_EXTENSION } from 'pixu';

const result = await compress(file, {
  format: 'image/pixu',
  enableSmartQuality: true,
  stripMetadata: true,
});

console.log(result.compressionRatio);
console.log(PIXU_EXTENSION); // ".pixu"
```

## Teoria

O Pixu minimiza os bytes enviados sob [Entropia Reconstrutiva Contextual](/pt-BR/guide/theory/contextual-reconstructive-entropy) — $L(x \mid M, C, \varepsilon)$ — sem reivindicar superar Shannon de forma lossless.

## Experimente ao vivo

Escolha uma foto de exemplo ou envie a sua — o mesmo layout dos exemplos de framework.

<CompressionDemo :options="{ format: 'image/pixu', enableSmartQuality: true }" />

<VueDemo :options="{ format: 'image/pixu', enableSmartQuality: true }" />

## Exemplos por framework

| Framework | Porta | Comando |
|-----------|------|---------|
| [Vue 3](/pt-BR/examples/vue) | 3000 | `cd examples/vue && npm run dev` |
| [React](/pt-BR/examples/react-example) | 3001 | `cd examples/react && npm run dev` |
| [Angular](/pt-BR/examples/angular) | 4200 | `cd examples/angular && npm start` |
| [Svelte](/pt-BR/examples/svelte) | 3002 | `cd examples/svelte && npm run dev` |
| [Jacaré](/pt-BR/examples/jacare) | 3003 | `cd examples/jacare && npm run dev` |

Compile a biblioteca primeiro: `npm run build` na raiz do repositório.

[Ver todos os exemplos de framework →](/pt-BR/examples/)

## Mapa da documentação

- [Começando](/pt-BR/guide/getting-started) — instalação e primeira compressão
- [Formato PIXU](/pt-BR/guide/features/pixu-format) — formato de saída proprietário
- [Componentes](/pt-BR/guide/components/vue) — Vue, React, Angular, Svelte, Jacaré
- [Referência da API](/pt-BR/api/compress) — compress, compressBatch, tipos
- [Exemplos de código](/pt-BR/examples/basic) — presets, filtros, workers, batch

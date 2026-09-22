# Demo ao vivo

Demos interativas do Pixu com **imagens de exemplo reais**. A mesma linguagem visual dos exemplos de framework.

## Comprimir com PIXU (TECR)

<CompressionDemo :options="{ format: 'image/pixu', enableSmartQuality: true }" />

## Componente Vue

<VueDemo :options="{ format: 'image/pixu', enableSmartQuality: true, quality: 0.85 }" />

## O que você pode experimentar

- Clique em qualquer **foto de exemplo** (montanhas, retrato, cidade, floresta, comida, PNG)
- Ou **envie** sua própria imagem
- Original vs comprimido lado a lado
- Baixe o resultado `.pixu` (ou outro formato)

## Configurações recomendadas

| Objetivo | Opções |
|------|---------|
| Melhor compressão | `{ format: 'image/pixu', enableSmartQuality: true }` |
| Fotos para web | `{ preset: 'web' }` |
| Redes sociais | `{ preset: 'social-media', maxWidth: 1080 }` |
| Miniaturas | `{ preset: 'thumbnail' }` |

## Código do componente

```vue
<template>
  <PixuCompressor
    :samples="sampleImages"
    :options="{
      format: 'image/pixu',
      enableSmartQuality: true,
      stripMetadata: true,
    }"
    @compress="handleCompress"
  />
</template>
```

## Playgrounds por framework

| Framework | Página da docs | App local |
|-----------|-----------|-----------|
| [Vue](/pt-BR/examples/vue) | VueDemo ao vivo | `:3000` |
| [React](/pt-BR/examples/react-example) | ReactDemo ao vivo | `:3001` |
| [Angular](/pt-BR/examples/angular) | AngularDemo ao vivo | `:4200` |
| [Svelte](/pt-BR/examples/svelte) | SvelteDemo ao vivo | `:3002` |
| [Jacaré](/pt-BR/examples/jacare) | código + API | `:3003` |

Compile primeiro: `npm run build` na raiz do repositório.

## Próximos passos

- [Teoria TECR](/pt-BR/guide/theory/contextual-reconstructive-entropy)
- [Formato PIXU](/pt-BR/guide/features/pixu-format)
- [Todos os exemplos de framework](/pt-BR/examples/)
- [Referência da API](/pt-BR/api/compress)

# Exemplos por framework

Projetos executáveis que compartilham o **mesmo layout de documentação** deste site — cabeçalho, galeria de amostras, cards de seção, roxo da marca — além de demos ao vivo abaixo.

## Demos ao vivo (nesta página)

### Compressão PIXU

<CompressionDemo :options="{ format: 'image/pixu', enableSmartQuality: true }" />

### Componente Vue

<VueDemo :options="{ format: 'image/pixu', enableSmartQuality: true }" />

### APIs React / Angular / Svelte

<ReactDemo :options="{ format: 'image/pixu', enableSmartQuality: true }" />

## Antes de rodar os apps locais

```bash
npm run build
```

Depois abra qualquer pasta de exemplo, instale as dependências e inicie o servidor de desenvolvimento.

## Projetos disponíveis

| Framework | Pasta | Servidor de dev | Docs |
|-----------|--------|------------|------|
| **Vue 3** | `examples/vue/` | `:3000` | [Vue](/pt-BR/examples/vue) |
| **React** | `examples/react/` | `:3001` | [React](/pt-BR/examples/react-example) |
| **Angular** | `examples/angular/` | `:4200` | [Angular](/pt-BR/examples/angular) |
| **Svelte** | `examples/svelte/` | `:3002` | [Svelte](/pt-BR/examples/svelte) |
| **Jacaré** | `examples/jacare/` | `:3003` | [Jacaré](/pt-BR/examples/jacare) |

### Vue 3

```bash
cd examples/vue && npm install && npm run dev
```

### React

```bash
cd examples/react && npm install && npm run dev
```

### Angular

```bash
cd examples/angular && npm install && npm start
```

### Svelte

```bash
cd examples/svelte && npm install && npm run dev
```

### Jacaré

```bash
cd examples/jacare && npm install && npm run dev
```

## Layout compartilhado

Todos os apps usam `examples/shared/theme.css` — o mesmo chrome de documentação do VitePress:

- Largura do conteúdo ~960px
- Cabeçalho + logo
- Galeria de amostras
- Cards de seção
- Roxo da marca `#7b3fef`

As fotos de amostra ficam em `examples/shared/assets/` (também copiadas para `docs/public/` para estas demos ao vivo).

## Importando o Pixu

```typescript
import { compress, PIXU_EXTENSION } from 'pixu'
```

## Receita de melhor compressão

```typescript
const result = await compress(file, {
  format: 'image/pixu',
  enableSmartQuality: true,
})
```

Veja [Formato PIXU](/pt-BR/guide/features/pixu-format) e [TECR](/pt-BR/guide/theory/contextual-reconstructive-entropy).

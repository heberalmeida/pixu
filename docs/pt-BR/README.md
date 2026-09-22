# Documentação do Pixu

Site VitePress da biblioteca de compressão de imagens Pixu.

## Desenvolvimento

```bash
npm run build          # build pixu library first
npm run dev            # start docs at http://localhost:5173
```

## Build e preview

```bash
npm run docs:build
npm run docs:preview   # http://localhost:4173
```

## Estrutura

| Caminho | Conteúdo |
|------|---------|
| `/` | Home — hero, recursos, demo ao vivo |
| `/demo` | Demo interativa do componente Vue |
| `/guide/*` | Primeiros passos, recursos, componentes |
| `/api/*` | compress, compressBatch, types |
| `/examples/` | Hub de projetos por framework |
| `/examples/basic` | Padrões de código em Vanilla JS |

## Páginas principais

- [Primeiros passos](/pt-BR/guide/getting-started)
- [Formato PIXU](/pt-BR/guide/features/pixu-format)
- [Exemplos por framework](/pt-BR/examples/)
- [Componente Vue](/pt-BR/guide/components/vue)
- [Tipos da API](/pt-BR/api/types)

## Assets

- Logo: `docs/public/logo.png`
- Bundle da biblioteca para demos: `docs/public/pixu.esm.js` (copiado no `docs:build`)

## Rotas

Use caminhos **sem** `.html`:

- `/examples/vue`
- `/examples/vue.html`

Versão em português: prefixo `/pt-BR/` (ex.: `/pt-BR/examples/vue`).

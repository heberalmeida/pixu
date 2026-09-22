# Formatos de Imagem Suportados

O Pixu oferece suporte a uma ampla variedade de formatos de imagem para entrada e saída.

## Formatos de Entrada

O Pixu pode comprimir imagens nos seguintes formatos:

### Formatos Comuns

- **JPEG** (`image/jpeg`, `.jpg`, `.jpeg`)
  - Formato mais comum para fotos
  - Compressão com perda
  - Sem suporte a transparência

- **PNG** (`image/png`, `.png`)
  - Compressão sem perda
  - Suporte a transparência
  - Ideal para gráficos e capturas de tela

- **WebP** (`image/webp`, `.webp`)
  - Formato moderno com excelente compressão
  - Suporta com e sem perda
  - Suporte a transparência

- **AVIF** (`image/avif`, `.avif`)
  - Formato de nova geração
  - Melhor taxa de compressão
  - Suporte em navegadores modernos

### Formatos Adicionais

- **GIF** (`image/gif`, `.gif`)
  - Suporte a animação
  - Paleta de cores limitada

- **BMP** (`image/bmp`, `.bmp`)
  - Formato sem compressão
  - Arquivos grandes

- **SVG** (`image/svg+xml`, `.svg`)
  - Formato vetorial
  - Escalável sem perda de qualidade

- **TIFF** (`image/tiff`, `.tiff`, `.tif`)
  - Formato de alta qualidade
  - Frequentemente usado em fotografia profissional

- **ICO** (`image/x-icon`, `.ico`)
  - Formato de ícone
  - Vários tamanhos em um único arquivo

## Formatos de Saída

O Pixu pode gerar imagens em formatos otimizados:

### Formatos Padrão

1. **JPEG** (`image/jpeg`)
   - Suporte universal em navegadores
   - Ideal para fotos
   - Qualidade configurável (0.1 - 0.99)

2. **PNG** (`image/png`)
   - Compressão sem perda
   - Suporte a transparência
   - Ideal para gráficos

3. **WebP** (`image/webp`)
   - Excelente compressão
   - Suporte em navegadores modernos
   - Suporte a transparência

4. **AVIF** (`image/avif`)
   - Melhor taxa de compressão
   - Suporte em navegadores modernos
   - Alta qualidade

### Formato Proprietário

5. **PIXU** (`format: 'image/pixu'` → `.webp` / `.jpg`)
   - Formato reconstrutivo sob [TECR](/pt-BR/guide/theory/contextual-reconstructive-entropy)
   - Melhor $C_{\text{file}}$ sob $\varepsilon$ perceptual
   - Tipicamente 30–60% menor que JPEG, 20–40% vs WebP
   - Contexto $C$ adaptativo + Smart Quality
   - Veja o [Guia do Formato PIXU](./pixu-format.md)

### Seleção Automática

Use `format: 'auto'` para o Pixu selecionar automaticamente o melhor formato:

```typescript
const result = await compress(file, {
  format: 'auto', // Prefers PIXU, then WebP, then original
});
```

## Guia de Seleção de Formato

### Para Fotos

- **Melhor**: PIXU ou WebP
- **Universal**: JPEG
- **Qualidade máxima**: AVIF

### Para Gráficos

- **Melhor**: PNG (se precisar de transparência) ou PIX
- **Compressão**: WebP ou PIX
- **Sem perda**: PNG

### Para Web

- **Melhor**: PIXU (melhor compressão)
- **Moderno**: WebP ou AVIF
- **Fallback**: JPEG

### Para Impressão

- **Melhor**: JPEG (alta qualidade)
- **Profissional**: TIFF (se suportado)

## Comparação de Formatos

| Formato | Compressão | Qualidade | Transparência | Suporte no Navegador | Ideal Para |
|--------|------------|---------|--------------|-----------------|----------|
| JPEG   | Boa       | Boa    | Não           | Universal       | Fotos   |
| PNG    | Regular       | Excelente | Sim        | Universal       | Gráficos |
| WebP   | Muito Boa  | Muito Boa | Sim        | Moderno          | Web      |
| AVIF   | Excelente  | Excelente | Sim        | Moderno          | Web Moderna |
| **PIXU**| **Melhor**   | **Excelente** | **Sim** | **Universal** | **Web (Melhor)** |

## Configurações de Qualidade

Formatos diferentes suportam faixas de qualidade distintas:

- **JPEG/WebP/PIXU**: 0.1 - 0.99 (menor = mais compressão)
- **PNG**: Sem perda (configuração de qualidade ignorada)
- **AVIF**: 0.1 - 0.99 (excelente em qualidades mais baixas)

## Conversão de Formato

O Pixu pode converter automaticamente entre formatos:

```typescript
// Convert PNG to JPEG (if no transparency)
const result = await compress(pngFile, {
  convertToJPEG: true,
});

// Force specific format
const result = await compress(file, {
  format: 'image/webp',
});
```

## Compatibilidade com Navegadores

### Suporte Universal

- JPEG
- PNG
- GIF
- BMP

### Suporte em Navegadores Modernos

- WebP (Chrome, Firefox, Edge, Safari 14+)
- AVIF (Chrome 85+, Firefox 93+, Edge 85+)

### Aprimorado pelo Pixu

- PIXU (Universal via codificação Pixu)

## Recomendações

### Compressão Máxima

```typescript
format: 'image/pixu', // or 'auto' (auto selects PIXU)
quality: 0.6,
```

### Equilibrado

```typescript
format: 'auto', // Automatically selects PIXU for best compression
quality: 0.8,
```

### Alta Qualidade

```typescript
format: 'image/pixu', // Best compression even at high quality
quality: 0.9,
```

### Compatibilidade Máxima

```typescript
format: 'image/jpeg', // Universal browser support
quality: 0.85,
```

## Exemplos

### Usando o Formato PIXU

```typescript
import { compress } from 'pixu';

const result = await compress(file, {
  format: 'image/pixu',
  quality: 0.85,
  enableSmartQuality: true,
});
```

### Seleção Automática de Formato

```typescript
const result = await compress(file, {
  format: 'auto', // Will use PIXU for best compression
});
```

### Formato com Fallback

```typescript
const result = await compress(file, {
  format: 'image/webp', // Falls back to JPEG if not supported
});
```

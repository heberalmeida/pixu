import type { DefaultTheme } from 'vitepress'

export function guideSidebar(prefix = ''): DefaultTheme.SidebarItem[] {
  const p = prefix
  return [
    {
      text: prefix ? 'Primeiros passos' : 'Getting Started',
      items: [
        { text: prefix ? 'Introdução' : 'Introduction', link: `${p}/guide/getting-started` },
        { text: prefix ? 'Instalação' : 'Installation', link: `${p}/guide/installation` },
        { text: prefix ? 'Início rápido' : 'Quick Start', link: `${p}/guide/quick-start` },
      ],
    },
    {
      text: prefix ? 'Teoria' : 'Theory',
      items: [
        {
          text: prefix
            ? 'Entropia Contextual Reconstrutiva'
            : 'Contextual Reconstructive Entropy',
          link: `${p}/guide/theory/contextual-reconstructive-entropy`,
        },
      ],
    },
    {
      text: prefix ? 'Recursos' : 'Features',
      items: [
        { text: prefix ? 'Formatos suportados' : 'Supported Formats', link: `${p}/guide/features/supported-formats` },
        { text: 'PIXU Format', link: `${p}/guide/features/pixu-format` },
        { text: prefix ? 'Presets de compressão' : 'Compression Presets', link: `${p}/guide/features/presets` },
        { text: prefix ? 'Filtros de imagem' : 'Image Filters', link: `${p}/guide/features/filters` },
        { text: 'Smart Quality', link: `${p}/guide/features/smart-quality` },
        { text: prefix ? 'Otimização PNG' : 'PNG Optimization', link: `${p}/guide/features/png-optimization` },
        { text: prefix ? 'Recorte inteligente' : 'Smart Cropping', link: `${p}/guide/features/smart-crop` },
        { text: 'Watermark', link: `${p}/guide/features/watermark` },
        { text: prefix ? 'Conversão de formato' : 'Format Conversion', link: `${p}/guide/features/format-conversion` },
        { text: prefix ? 'Análise de imagem' : 'Image Analysis', link: `${p}/guide/features/image-analysis` },
        { text: prefix ? 'Processamento em lote' : 'Batch Processing', link: `${p}/guide/features/batch-processing` },
        { text: prefix ? 'Monitoramento de performance' : 'Performance Monitoring', link: `${p}/guide/features/performance` },
      ],
    },
    {
      text: prefix ? 'Componentes' : 'Components',
      items: [
        { text: prefix ? 'Componente Vue' : 'Vue Component', link: `${p}/guide/components/vue` },
        { text: prefix ? 'Componente React' : 'React Component', link: `${p}/guide/components/react` },
        { text: prefix ? 'Componente Angular' : 'Angular Component', link: `${p}/guide/components/angular` },
        { text: prefix ? 'Componente Svelte' : 'Svelte Component', link: `${p}/guide/components/svelte` },
        { text: prefix ? 'Componente Jacaré' : 'Jacaré Component', link: `${p}/guide/components/jacare` },
      ],
    },
    {
      text: prefix ? 'Exemplos de frameworks' : 'Framework Examples',
      items: [
        { text: prefix ? 'Visão geral' : 'Overview', link: `${p}/examples/` },
        { text: 'Vue', link: `${p}/examples/vue` },
        { text: 'React', link: `${p}/examples/react-example` },
        { text: 'Angular', link: `${p}/examples/angular` },
        { text: 'Svelte', link: `${p}/examples/svelte` },
        { text: 'Jacaré', link: `${p}/examples/jacare` },
      ],
    },
  ]
}

export function apiSidebar(prefix = ''): DefaultTheme.SidebarItem[] {
  const p = prefix
  return [
    {
      text: prefix ? 'Referência da API' : 'API Reference',
      items: [
        { text: 'compress', link: `${p}/api/compress` },
        { text: 'compressBatch', link: `${p}/api/compress-batch` },
        { text: 'compressStream', link: `${p}/api/compress-stream` },
        { text: 'validateImage', link: `${p}/api/validate-image` },
        { text: 'analyzeImage', link: `${p}/api/analyze-image` },
        { text: prefix ? 'Tipos' : 'Types', link: `${p}/api/types` },
      ],
    },
  ]
}

export function examplesSidebar(prefix = ''): DefaultTheme.SidebarItem[] {
  const p = prefix
  return [
    {
      text: prefix ? 'Projetos de frameworks' : 'Framework Projects',
      items: [
        { text: prefix ? 'Visão geral' : 'Overview', link: `${p}/examples/` },
        { text: 'Vue', link: `${p}/examples/vue` },
        { text: 'React', link: `${p}/examples/react-example` },
        { text: 'Angular', link: `${p}/examples/angular` },
        { text: 'Svelte', link: `${p}/examples/svelte` },
        { text: 'Jacaré', link: `${p}/examples/jacare` },
      ],
    },
    {
      text: prefix ? 'Exemplos de código' : 'Code Examples',
      items: [
        { text: prefix ? 'Uso básico' : 'Basic Usage', link: `${p}/examples/basic` },
        { text: prefix ? 'Opções avançadas' : 'Advanced Options', link: `${p}/examples/advanced` },
        { text: 'Presets', link: `${p}/examples/presets` },
        { text: prefix ? 'Filtros' : 'Filters', link: `${p}/examples/filters` },
        { text: 'Web Workers', link: `${p}/examples/workers` },
        { text: prefix ? 'Processamento em lote' : 'Batch Processing', link: `${p}/examples/batch` },
      ],
    },
  ]
}

export function nav(prefix = ''): DefaultTheme.NavItem[] {
  const p = prefix
  return [
    { text: prefix ? 'Início' : 'Home', link: `${p}/` },
    { text: 'Demo', link: `${p}/demo` },
    { text: prefix ? 'Guia' : 'Guide', link: `${p}/guide/getting-started` },
    { text: 'API', link: `${p}/api/compress` },
    { text: prefix ? 'Exemplos' : 'Examples', link: `${p}/examples/` },
    { text: 'GitHub', link: 'https://github.com/heberalmeida/pixu' },
  ]
}

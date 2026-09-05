import { defineConfig } from 'vitepress';
import { resolve } from 'path';

export default defineConfig({
  title: 'Pixu',
  description: 'Best perceptual image compression via Contextual Reconstructive Entropy — PIXU format for the web',
  base: '/',
  
  vite: {
    resolve: {
      alias: {
        'pixu': resolve(__dirname, '../../dist/pixu.esm.js'),
        '@components': resolve(__dirname, '../../components'),
      },
    },
    optimizeDeps: {
      include: ['pixu'],
    },
    ssr: {
      noExternal: [],
    },
  },
  
  themeConfig: {
    logo: '/logo.png',

    nav: [
      { text: 'Home', link: '/' },
      { text: 'Demo', link: '/demo' },
      { text: 'Guide', link: '/guide/getting-started' },
      { text: 'API', link: '/api/compress' },
      { text: 'Examples', link: '/examples/' },
      { text: 'GitHub', link: 'https://github.com/heberalmeida/pixu' }
    ],
    
    sidebar: {
      '/guide/': [
        {
          text: 'Getting Started',
          items: [
            { text: 'Introduction', link: '/guide/getting-started' },
            { text: 'Installation', link: '/guide/installation' },
            { text: 'Quick Start', link: '/guide/quick-start' }
          ]
        },
        {
          text: 'Theory',
          items: [
            {
              text: 'Contextual Reconstructive Entropy',
              link: '/guide/theory/contextual-reconstructive-entropy'
            }
          ]
        },
        {
          text: 'Features',
          items: [
            { text: 'Supported Formats', link: '/guide/features/supported-formats' },
            { text: 'PIXU Format', link: '/guide/features/pixu-format' },
            { text: 'Compression Presets', link: '/guide/features/presets' },
            { text: 'Image Filters', link: '/guide/features/filters' },
            { text: 'Smart Quality', link: '/guide/features/smart-quality' },
            { text: 'PNG Optimization', link: '/guide/features/png-optimization' },
            { text: 'Smart Cropping', link: '/guide/features/smart-crop' },
            { text: 'Watermark', link: '/guide/features/watermark' },
            { text: 'Format Conversion', link: '/guide/features/format-conversion' },
            { text: 'Image Analysis', link: '/guide/features/image-analysis' },
            { text: 'Batch Processing', link: '/guide/features/batch-processing' },
            { text: 'Performance Monitoring', link: '/guide/features/performance' }
          ]
        },
        {
          text: 'Components',
          items: [
            { text: 'Vue Component', link: '/guide/components/vue' },
            { text: 'React Component', link: '/guide/components/react' },
            { text: 'Angular Component', link: '/guide/components/angular' },
            { text: 'Svelte Component', link: '/guide/components/svelte' },
            { text: 'Jacaré Component', link: '/guide/components/jacare' }
          ]
        },
        {
          text: 'Framework Examples',
          items: [
            { text: 'Overview', link: '/examples/' },
            { text: 'Vue', link: '/examples/vue' },
            { text: 'React', link: '/examples/react-example' },
            { text: 'Angular', link: '/examples/angular' },
            { text: 'Svelte', link: '/examples/svelte' },
            { text: 'Jacaré', link: '/examples/jacare' }
          ]
        }
      ],
      '/api/': [
        {
          text: 'API Reference',
          items: [
            { text: 'compress', link: '/api/compress' },
            { text: 'compressBatch', link: '/api/compress-batch' },
            { text: 'compressStream', link: '/api/compress-stream' },
            { text: 'validateImage', link: '/api/validate-image' },
            { text: 'analyzeImage', link: '/api/analyze-image' },
            { text: 'Types', link: '/api/types' }
          ]
        }
      ],
      '/examples/': [
        {
          text: 'Framework Projects',
          items: [
            { text: 'Overview', link: '/examples/' },
            { text: 'Vue', link: '/examples/vue' },
            { text: 'React', link: '/examples/react-example' },
            { text: 'Angular', link: '/examples/angular' },
            { text: 'Svelte', link: '/examples/svelte' },
            { text: 'Jacaré', link: '/examples/jacare' }
          ]
        },
        {
          text: 'Code Examples',
          items: [
            { text: 'Basic Usage', link: '/examples/basic' },
            { text: 'Advanced Options', link: '/examples/advanced' },
            { text: 'Presets', link: '/examples/presets' },
            { text: 'Filters', link: '/examples/filters' },
            { text: 'Web Workers', link: '/examples/workers' },
            { text: 'Batch Processing', link: '/examples/batch' },
          ]
        }
      ]
    },
    
    socialLinks: [
      { icon: 'github', link: 'https://github.com/heberalmeida/pixu' }
    ],
    
    footer: {
      message: 'Released under the MIT License.',
      copyright: 'Copyright © 2025 Heber Almeida'
    }
  }
});


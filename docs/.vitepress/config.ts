import { defineConfig } from 'vitepress'
import { resolve } from 'path'
import { apiSidebar, examplesSidebar, guideSidebar, nav } from './config/sidebars'

export default defineConfig({
  title: 'Pixu',
  description:
    'Best perceptual image compression via Contextual Reconstructive Entropy — PIXU format for the web',
  base: '/',

  markdown: {
    math: true,
  },

  vite: {
    resolve: {
      alias: {
        pixu: resolve(__dirname, '../../dist/pixu.esm.js'),
        '@components': resolve(__dirname, '../../components'),
      },
    },
    optimizeDeps: {
      exclude: ['pixu'],
    },
    ssr: {
      noExternal: [],
    },
  },

  locales: {
    root: {
      label: 'English',
      lang: 'en',
      title: 'Pixu',
      description:
        'Best perceptual image compression via Contextual Reconstructive Entropy — PIXU format for the web',
      themeConfig: {
        nav: nav(),
        sidebar: {
          '/guide/': guideSidebar(),
          '/api/': apiSidebar(),
          '/examples/': examplesSidebar(),
        },
        outline: { label: 'On this page' },
        docFooter: { prev: 'Previous', next: 'Next' },
        returnToTopLabel: 'Return to top',
        sidebarMenuLabel: 'Menu',
        darkModeSwitchLabel: 'Appearance',
        lightModeSwitchTitle: 'Switch to light theme',
        darkModeSwitchTitle: 'Switch to dark theme',
        langMenuLabel: 'Change language',
        footer: {
          message: 'Released under the MIT License.',
          copyright: 'Copyright © 2025 Heber Almeida',
        },
      },
    },
    'pt-BR': {
      label: 'Português (Brasil)',
      lang: 'pt-BR',
      title: 'Pixu',
      description:
        'Melhor compressão perceptual de imagens via Entropia Contextual Reconstrutiva — formato PIXU para a web',
      themeConfig: {
        nav: nav('/pt-BR'),
        sidebar: {
          '/pt-BR/guide/': guideSidebar('/pt-BR'),
          '/pt-BR/api/': apiSidebar('/pt-BR'),
          '/pt-BR/examples/': examplesSidebar('/pt-BR'),
        },
        outline: { label: 'Nesta página' },
        docFooter: { prev: 'Anterior', next: 'Próximo' },
        returnToTopLabel: 'Voltar ao topo',
        sidebarMenuLabel: 'Menu',
        darkModeSwitchLabel: 'Aparência',
        lightModeSwitchTitle: 'Mudar para tema claro',
        darkModeSwitchTitle: 'Mudar para tema escuro',
        langMenuLabel: 'Mudar idioma',
        footer: {
          message: 'Publicado sob a licença MIT.',
          copyright: 'Copyright © 2025 Heber Almeida',
        },
      },
    },
  },

  themeConfig: {
    logo: '/logo.png',
    socialLinks: [{ icon: 'github', link: 'https://github.com/heberalmeida/pixu' }],
  },
})

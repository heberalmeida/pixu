import { resolve, dirname } from 'path'
import { fileURLToPath } from 'url'
import jacareConfig from './jacare.config.js'
import { createJacareViteConfig } from '@jacare/vite-plugin'

const __dirname = dirname(fileURLToPath(import.meta.url))

export default createJacareViteConfig({
  ...jacareConfig,
  resolve: {
    alias: {
      pixu: resolve(__dirname, '../../dist/pixu.esm.js'),
    },
  },
  server: {
    fs: {
      allow: [resolve(__dirname, '../..')],
    },
  },
})

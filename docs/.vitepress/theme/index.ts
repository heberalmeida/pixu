import type { Theme } from 'vitepress'
import DefaultTheme from 'vitepress/theme'
import './custom.css'
import CompressionDemo from '../components/CompressionDemo.vue'
import VueDemo from '../components/VueDemo.vue'
import ReactDemo from '../components/ReactDemo.vue'
import AngularDemo from '../components/AngularDemo.vue'
import SvelteDemo from '../components/SvelteDemo.vue'
import JacareDemo from '../components/JacareDemo.vue'
import PixuCompressor from '../../../components/vue/PixuCompressor.vue'

export default {
  extends: DefaultTheme,
  enhanceApp({ app }) {
    app.component('CompressionDemo', CompressionDemo)
    app.component('VueDemo', VueDemo)
    app.component('ReactDemo', ReactDemo)
    app.component('AngularDemo', AngularDemo)
    app.component('SvelteDemo', SvelteDemo)
    app.component('JacareDemo', JacareDemo)
    app.component('PixuCompressor', PixuCompressor)
  }
} satisfies Theme

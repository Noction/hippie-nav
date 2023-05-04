import Components from 'unplugin-vue-components/vite'
import Icons from 'unplugin-icons/vite'
import IconsResolver from 'unplugin-icons/resolver'
import Vue from '@vitejs/plugin-vue'
import { defineConfig } from 'vite'
import { resolve } from 'path'
import svgLoader from 'vite-svg-loader'

export default defineConfig({
  build: {
    outDir: resolve(__dirname, '..', '..', 'docs')
  },
  plugins: [
    Vue(),
    Components({
      resolvers: [
        IconsResolver()
      ]
    }),
    Icons({ autoInstall: true }),
    svgLoader()
  ],
  resolve: {
    alias: { vue: 'vue/dist/vue.esm-bundler.js' },
    dedupe: ['vue']
  }
})

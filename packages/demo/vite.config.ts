import Components from 'unplugin-vue-components/vite'
import Icons from 'unplugin-icons/vite'
import IconsResolver from 'unplugin-icons/resolver'
import Vue from '@vitejs/plugin-vue'
import { defineConfig } from 'vite'
import path from 'path'

const outDir = path.resolve(__dirname, '..', '..', 'docs')

// https://vitejs.dev/config/
export default defineConfig({
  build: {
    outDir
  },
  plugins: [
    Vue(),
    Components({
      resolvers: [
        IconsResolver()
      ]
    }),
    Icons({
      autoInstall: true
    })
  ],
  resolve: {
    alias: { vue: 'vue/dist/vue.esm-bundler.js' },
    dedupe: ['vue']
  }
})

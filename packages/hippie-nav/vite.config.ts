import { defineConfig } from 'vite'
import { resolve } from 'path'
import svgLoader from 'vite-svg-loader'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  build: {
    emptyOutDir: process.env.NODE_ENV !== 'development',
    lib: {
      entry: resolve(__dirname, './src/index.ts'),
      name: 'HippieNav'
    },
    rollupOptions: {
      external: ['vue', 'vue-router'],
      output: {
        exports: 'named',
        globals: { vue: 'Vue', 'vue-router': 'VueRouter' }
      }
    }
  },
  plugins: [vue(), svgLoader() as Plugin],
  resolve: {
    alias: {
      '@': resolve(__dirname, './src')
    }
  }
})

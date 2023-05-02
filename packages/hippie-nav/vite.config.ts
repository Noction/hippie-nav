import { defineConfig } from 'vite'
import { resolve } from 'path'
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
        globals: { vue: 'Vue', 'vue-router': 'VueRouter' }
      }
    }
  },
  define: {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    VERSION: JSON.stringify(require('./package.json').version)
  },
  plugins: [vue()],
  resolve: {
    alias: {
      '@': resolve(__dirname, './src')
    }
  }
})

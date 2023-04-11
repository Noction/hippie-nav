import { defineConfig } from 'vite'
import { resolve } from 'path'
import vue from '@vitejs/plugin-vue'
import commonjs from 'vite-plugin-commonjs'

export default defineConfig({
  build: {
    emptyOutDir: process.env.NODE_ENV !== 'development',
    lib: {
      entry: resolve(__dirname, './src/index.ts'),
      name: 'HippieNav'
    },
    rollupOptions: {
      external: ['vue'],
      output: {
        globals: { vue: 'Vue' }
      }
    }
  },
  define: {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    VERSION: JSON.stringify(require('./package.json').version)
  },
  plugins: [vue(), commonjs({

  })]
})

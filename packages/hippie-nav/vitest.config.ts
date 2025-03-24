import { resolve } from 'node:path'
import vue from '@vitejs/plugin-vue'
import svgLoader from 'vite-svg-loader'
import { configDefaults, defineConfig } from 'vitest/config'

export default defineConfig({
  plugins: [vue(), svgLoader() as Plugin],
  resolve: {
    alias: {
      '@': resolve(__dirname, './src'),
    },
  },
  test: {
    outputFile: './test-report.junit.xml',
    reporters: ['junit', 'verbose'],
    coverage: {
      all: true,
      exclude: [
        ...configDefaults.exclude,
        'src/assets/*',
        'src/index.ts',
        'src/types/*',
        'src/*.d.ts',
        'tests',
        '*rc.ts',
        '*rc.js',
      ],
      provider: 'v8',
      reporter: ['cobertura', 'text'],
    },
    environment: 'jsdom',
    globals: true,
    include: ['tests/unit/**/*.spec.ts', 'tests/integration/**/*.spec.ts'],
  },
})

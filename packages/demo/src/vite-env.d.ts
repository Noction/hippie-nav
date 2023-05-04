/// <reference types="vite/client" />
/// <reference types="vite-svg-loader" />

import 'vue-router'

declare module 'vue-router' {
  interface RouteMeta {
    aliases?: string[]
  }
}
/// <reference types="vite/client" />
/// <reference types="vite-svg-loader" />

import 'vue-router'

declare module 'vue-router' {
  export interface RouteMeta {
    hippieNavMeta?: HippieNavMeta
  }
}

interface HippieNavMeta {
  [k: string]: string | string[]
}
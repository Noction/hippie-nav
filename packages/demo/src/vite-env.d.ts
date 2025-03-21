/// <reference types="vite/client" />
/// <reference types="vite-svg-loader" />

import 'vue-router'

declare module 'vue-router' {
  export type RouteMeta = {
    hippieNavMeta?: HippieNavMeta
  }
}

type HippieNavMeta = {
  [k: string]: string | string[]
}

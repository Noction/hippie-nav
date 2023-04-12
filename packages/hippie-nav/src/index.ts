import { App } from 'vue'
import PrivateHippieNav from './HippieNav.vue'

export {
  PrivateHippieNav
}

interface AppOptions {
  excludedPaths: string[]
}
export const excludedPaths = Symbol()
export function install (app: App, options: AppOptions) {
  app.component('HippieNav', PrivateHippieNav)

  app.provide(excludedPaths, options.excludedPaths)
}

export default {
  install
}

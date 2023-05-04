import { App } from 'vue'
import PrivateHippieNav from './components/HippieNav.vue'

interface AppOptions {
  excludedPaths: (string | RegExp)[]
}

export const HippieNav = PrivateHippieNav

export const excludedPaths = Symbol()

export function install (app: App, options: AppOptions = { excludedPaths: [] }) {
  app.component('HippieNav', PrivateHippieNav)
  app.provide(excludedPaths, options.excludedPaths)
}

export default { install }

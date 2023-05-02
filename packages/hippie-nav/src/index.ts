import { App } from 'vue'
import HighlightDirective from './directives/textHighlight'
import PrivateHippieNav from './components/HippieNav.vue'

export const HippieNav = PrivateHippieNav

interface AppOptions {
  excludedPaths: (string | RegExp)[]
}

export const excludedPaths = Symbol()

export function install (app: App, options: AppOptions = {
  excludedPaths: []
}) {
  app.component('HippieNav', PrivateHippieNav)
  app.directive('highlight', HighlightDirective)
  app.provide(excludedPaths, options.excludedPaths)
}

export default { install }

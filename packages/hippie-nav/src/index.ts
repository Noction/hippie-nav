import { AppOptions } from '@/types'
import PrivateHippieNav from './components/HippieNav.vue'
import { App, InjectionKey } from 'vue'

export const HippieNav = PrivateHippieNav

export const hippieNavOptions: InjectionKey<AppOptions> = Symbol()

const defaultOptions: AppOptions = {
  excludedPaths: ['/register', '/login', '/signin', '/signup'],
  indexFields: {
    actions: ['name', 'aliases'],
    routes: ['path', 'name', 'aliases']
  }
}

export function install (app: App, options = defaultOptions ) {
  app.component('HippieNav', PrivateHippieNav)
  app.provide(hippieNavOptions, options)
}

export default { install }

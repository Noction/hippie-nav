import { AppOptions } from '@/types'
import PrivateHippieNav from './components/HippieNav.vue'
import { App, InjectionKey } from 'vue'

export const HippieNav = PrivateHippieNav

export const defaultOptions: AppOptions = {
  indexFields: {
    actions: ['name', 'aliases'],
    routes: ['path', 'name']
  },
  resultsLimit: 7
}

export const hippieNavOptions: InjectionKey<AppOptions> = Symbol()

export function install (app: App, options = defaultOptions ) {
  app.component('HippieNav', PrivateHippieNav)
  app.provide(hippieNavOptions, options)
}

export default { install }

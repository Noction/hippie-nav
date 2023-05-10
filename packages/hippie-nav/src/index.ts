import { AppOptions } from '@/types'
import PrivateHippieNav from './components/HippieNav.vue'
import { App, InjectionKey } from 'vue'

export const HippieNav = PrivateHippieNav

export const hippieNavOptions = <InjectionKey<AppOptions>>Symbol()

export function install (app: App, options: AppOptions) {
  app.component('HippieNav', PrivateHippieNav)
  app.provide(hippieNavOptions, options)
}

export default { install }

import { App } from 'vue'
import PrivateHippieNav from './HippieNav.vue'

export {
  PrivateHippieNav
}

export function install (app: App)  {
  app.component('HippieNav', PrivateHippieNav)
}

export default {
  install
}

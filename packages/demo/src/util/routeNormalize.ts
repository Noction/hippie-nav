import { RouteRecordRaw } from 'vue-router'
import { slashCounter } from './slashCounter'

export const routeNormalize = (routes : RouteRecordRaw[]) => {
  return routes.filter(r => {
    if (slashCounter(r.path) === 1) {
      return r
    }
  })
}

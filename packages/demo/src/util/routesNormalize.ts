import { slashCounter } from './slashCounter'
import { RouteRecordNormalized, RouteRecordRaw } from 'vue-router'

export const routesNormalize = (routes: RouteRecordRaw[]) => {
  const normalizedRoutes = routes.filter(r => {
    if (slashCounter(r.path) === 1) {
      return r
    }
  })

  return normalizedRoutes.sort((a, b) => {
    const nameA: RouteRecordNormalized['name'] = String(a.name).toUpperCase() || ''
    const nameB: RouteRecordNormalized['name'] = String(b.name).toUpperCase() || ''

    return nameA.localeCompare(nameB)
  })
}

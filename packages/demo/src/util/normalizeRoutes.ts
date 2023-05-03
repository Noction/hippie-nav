import { countSlashes } from './countSlashes'
import { RouteRecordNormalized, RouteRecordRaw } from 'vue-router'

export const normalizeRoutes = (routes: RouteRecordRaw[]) => {
  return routes
    .filter(r => (countSlashes(r.path) === 1))
    .sort((a, b) => {
      const nameA: RouteRecordNormalized['name'] = String(a.name).toUpperCase() || ''
      const nameB: RouteRecordNormalized['name'] = String(b.name).toUpperCase() || ''

      return nameA.localeCompare(nameB)
    })
}

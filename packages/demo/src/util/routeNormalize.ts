import { RouteRecordRaw } from 'vue-router'
import { slashCounter } from './slashCounter'

export const routeNormalize = (routes: RouteRecordRaw[]) => {
  const normalizedRoutes = routes.filter(r => {
    if (slashCounter(r.path) === 1) {
      return r
    }
  })

  return normalizedRoutes.sort((a, b) => {
    const nameA = String(a.name).toUpperCase() || ''
    const nameB = String(b.name).toUpperCase() || ''

    return nameA.localeCompare(nameB)
  })
}

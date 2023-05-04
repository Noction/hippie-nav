import { RouteRecordNormalized, RouteRecordRaw } from 'vue-router'

export function countSlashes  (path: string) {
  return path.split('/').length - 1
}

export function flattenRoutes (nestedRoutes: RouteRecordRaw[]): RouteRecordRaw[] {
  const routes: RouteRecordRaw[] = []

  nestedRoutes.forEach(nestedRoute => {
    routes.push(nestedRoute)
    if (nestedRoute.children) {
      nestedRoute.children.forEach(child =>
        routes.push({ ...child, path: `${nestedRoute.path}/${child.path}` }))
    }
  })

  return routes.filter((obj, index, self) => {
    return index === self.findIndex(t => (
      t.name === obj.name
    ))
  })
}

export function normalizeRoutes (routes: RouteRecordRaw[]) {
  return routes
    .filter(r => (countSlashes(r.path) === 1))
    .sort((a, b) => {
      const nameA: RouteRecordNormalized['name'] = String(a.name).toUpperCase() || ''
      const nameB: RouteRecordNormalized['name'] = String(b.name).toUpperCase() || ''

      return nameA.localeCompare(nameB)
    })
}

import { RouteRecordNormalized } from 'vue-router'

export const routesFlatten = (nestedRoutes: RouteRecordNormalized[]): RouteRecordNormalized[] => {
  const routes = [] as RouteRecordNormalized[]

  nestedRoutes.forEach(r => {
    if (r) {
      routes.push(r)
      if (r.children) {
        for (const child of r.children) {
          routes.push({
            ...child,
            path: `${r.path  }/${  child.path}`
          } as RouteRecordNormalized)
        }
      }
    }
  })
  return routes.filter((obj, index, self) => {
    return index === self.findIndex(t => (
      t.name === obj.name
    ))
  })
}
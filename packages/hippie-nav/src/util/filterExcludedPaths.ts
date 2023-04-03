import { RouteRecordNormalized } from 'vue-router'

export const filterExcludedPaths = (routes: RouteRecordNormalized[], excludedPaths: string[]) => {

  console.log(routes.filter(route => !excludedPaths.includes(route.path)))
  return routes.filter(route => !excludedPaths.includes(route.path))
}

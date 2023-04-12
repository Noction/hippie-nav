import { RouteRecordNormalized } from 'vue-router'

export const filterExcludedPaths = (routes: RouteRecordNormalized[], excludedPaths: string[]) => {
  return routes.filter(route => !excludedPaths.includes(route.path))
}

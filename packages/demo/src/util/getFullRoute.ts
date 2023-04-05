import { RouteRecordNormalized, Router } from 'vue-router'

export const getFullPath = (name: RouteRecordNormalized['name'], router: Router) => {
  const routes = router.getRoutes()

  const route = routes.find(r => {
    if (r.name === name) {
      return r
    }
  })

  return route?.path
}

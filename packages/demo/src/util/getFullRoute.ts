import { RouteRecordNormalized } from 'vue-router'

export const getFullPath = (name: RouteRecordNormalized['name'], routes: RouteRecordNormalized[]) => {
  const route = routes.find(r => {
    if (r.name === name) {
      return r
    }
  })

  return route?.path
}

import { RouteRecordNormalized } from 'vue-router'

export function getFullPath (name: string, routes: RouteRecordNormalized[]): string | undefined {
  const route = routes.find(r => r.name === name)

  return route ? route.path : undefined
}

export function hasDuplicateName (routes: RouteRecordNormalized[], name: string): boolean {
  return routes.some(r => r.name === name)
}

export function hasDuplicatePath (routes: RouteRecordNormalized[], path: string): boolean {
  return routes.some(r => r.path === path || r.path === '')
}
import { RouteRecordNormalized } from 'vue-router'
import { isActionConfig } from '@/types/typePredicates'

import { ActionConfig, ResultItem } from '@/types'
const LocalStorageItems = {
  ACTIONS_NAMES: 'actionsNames',
  ROUTE_PATHS: 'routePaths'
} as const

export const addLocalStorageRecentResults = (recentResults: ResultItem[]) => {
  const routesPaths: string[] = []
  const actionsNames: string[] = []

  for (const [i, recentResult] of recentResults.entries()) {
    if (!isActionConfig(recentResult.data)) {
      routesPaths.push(String(i) + recentResult.data.path)
    } else {
      actionsNames.push(String(i) + recentResult.data.name)
    }
  }
  localStorage.setItem(LocalStorageItems.ACTIONS_NAMES, actionsNames.join(','))
  localStorage.setItem(LocalStorageItems.ROUTE_PATHS, routesPaths.join(','))
}

export const extractLocalStoreRecentResults = (actions: ActionConfig[], routes: RouteRecordNormalized[]): ResultItem[] => {
  const routesPaths = localStorage.getItem(LocalStorageItems.ROUTE_PATHS)?.split(',')
  const actionNames = localStorage.getItem(LocalStorageItems.ACTIONS_NAMES)?.split(',')
  const recentResults: ResultItem[] = []

  if (routesPaths !== undefined) {
    for (const routePath of routesPaths) {
      const index = routePath.charAt(0)
      const route = routes.find(route => route.path === routePath.slice(1))

      recentResults[index] = {
        data: route,
        type: 'route'
      }
    }
  }

  if (actionNames !== undefined) {
    for (const actionName of actionNames) {
      const index = actionName.charAt(0)
      const action = actions.find(action => action.name === actionName.slice(1))

      recentResults[index] = {
        data: action,
        type: 'action'
      }
    }
  }
  return recentResults
}

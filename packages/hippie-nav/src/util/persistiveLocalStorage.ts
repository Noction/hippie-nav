import { RouteRecordNormalized } from 'vue-router'
import { assignIdsArray } from '@/util/helpers'
import { isActionConfig } from '@/types/typePredicates'
import { transformDataToResultData } from '@/util/helpers'

import { ActionConfig, ResultItem } from '@/types'

export const LocalStorageItems = {
  ACTIONS_NAMES: 'actionsNames',
  ROUTE_PATHS: 'routePaths'
} as const

export const addLocalStorageRecentResults = (recentResults: ResultItem[]) => {
  const routesPaths: string[] = []
  const actionsNames: string[] = []

  recentResults.forEach((rs, idx) => {
    if (!isActionConfig(rs.data)) {
      routesPaths[idx] = rs.data.path
    } else {
      actionsNames[idx] = rs.data.name
    }
  })

  localStorage.setItem(LocalStorageItems.ACTIONS_NAMES, JSON.stringify(actionsNames))
  localStorage.setItem(LocalStorageItems.ROUTE_PATHS, JSON.stringify(routesPaths))
}

export const extractLocalStoreRecentResults = (actions: ActionConfig[], routes: RouteRecordNormalized[]) => {
  const routesPaths: string[] = JSON.parse(localStorage.getItem(LocalStorageItems.ROUTE_PATHS))
  const actionNames: string[] = JSON.parse(localStorage.getItem(LocalStorageItems.ACTIONS_NAMES))
  const recentResults: (ActionConfig | RouteRecordNormalized)[] = []

  if (routesPaths) {
    routesPaths.forEach((path, idx) => {
      if (path === null) return
      const route = routes.find(route => route.path === path)

      if (route) {
        recentResults[idx] = route
      }
    })
  }

  if (actionNames) {
    actionNames.forEach((name, idx) => {
      if (!name === null) return
      const action = actions.find(action => action.name === name)

      if (action) {
        recentResults[idx] = action
      }
    })

  }
  return transformDataToResultData(assignIdsArray(recentResults.filter(r => r !== null)))
}

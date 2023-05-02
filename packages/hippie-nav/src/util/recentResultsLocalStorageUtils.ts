import { RouteRecordNormalized } from 'vue-router'
import { assignIdsArray } from '@/util/assignIdsArray'
import { isActionConfig } from '@/types/typePredicates'
import { transformDataToResultData } from '@/util/transformFlexDataToResult'

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

export const extractLocalStoreRecentResults = (actions: ActionConfig[], routes: RouteRecordNormalized[]) => {
  const routesPaths = localStorage.getItem(LocalStorageItems.ROUTE_PATHS)?.split(',')
  const actionNames = localStorage.getItem(LocalStorageItems.ACTIONS_NAMES)?.split(',')
  const recentResults: (ActionConfig | RouteRecordNormalized)[] = []

  if (routesPaths) {
    routesPaths.forEach(path => {
      const index = path.charAt(0)
      const route = routes.find(route => route.path === path.slice(1))

      if (route) {
        recentResults[index] = route
      }
    })
  }

  if (actionNames) {
    actionNames.forEach(name => {
      const index = name.charAt(0)
      const action = actions.find(action => action.name === name.slice(1))

      if (action) {
        recentResults[index] = action
      }
    })

  }
  return transformDataToResultData(assignIdsArray(recentResults.filter(r => r !== null)))
}

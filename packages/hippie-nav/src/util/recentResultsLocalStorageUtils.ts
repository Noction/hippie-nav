import { RouteRecordNormalized } from 'vue-router'
import { ActionConfig, ResultItem } from '../types'

const ROUTE_PATHS = 'routePaths'
const ACTIONS_NAMES = 'actionsNames'

export const addLocalStorageRecentResults = (recentResults: ResultItem[]) => {
  const actionsNames = recentResults
    .filter(recentResult => recentResult.type === 'action')
    .map(action => action.data.name) as string[]
  const routes: RouteRecordNormalized[] = recentResults
    .filter(recentResult => recentResult.type === 'route')
    .map(route => route.data) as RouteRecordNormalized[]
  const routesPaths = routes.map(route => route.path)

  localStorage.setItem(ROUTE_PATHS, routesPaths.join(','))
  localStorage.setItem(ACTIONS_NAMES, actionsNames.join(','))
}

export const extractLocalStoreRecentResults = (actions: ActionConfig[], routes: RouteRecordNormalized[]): ResultItem[] => {
  const routesPaths = localStorage.getItem(ROUTE_PATHS)?.split(',') ?? []
  const actionNames = localStorage.getItem(ACTIONS_NAMES)?.split(',') ?? []

  console.log('localstorage', routesPaths, actionNames)

  const resultsResults: ResultItem[] = routesPaths
    .map(routePath => {
      const route = routes.find(route => route.path === routePath)

      if (route === undefined) return
      return {
        data: route,
        type: 'route'
      }
    })

  const actionsResults: ResultItem[] = actionNames.map(actionName => {
    const action = actions.find(action => action.name === actionName)

    if (action === undefined) return
    return {
      data: action,
      type: 'action'
    }
  })

  return resultsResults ?? [].concat(actionsResults ?? [])
}

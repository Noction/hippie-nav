import { ActionConfig } from '../types'
import { IndexType } from './indexSetup'
import { RouteRecordNormalized } from 'vue-router'

export const useFlexSearch = (
  query: string,
  providedIndex: any,
  store: RouteRecordNormalized[] | ActionConfig[],
  type: IndexType
) => {

  if (type === 'route') {
    const routes = store as RouteRecordNormalized[]
    const results = providedIndex.search(query)

    return results[0]?.result.map((id: string) => {
      return routes.find(route => route.path === id)
    })
  }
  if (type === 'action') {
    const routes = store as ActionConfig[]
    const results = providedIndex.search(query)

    return results[0]?.result.map((id: string) => {
      return routes.find(action => action.name === id)
    })
  }
}

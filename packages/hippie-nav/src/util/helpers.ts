import { RouteRecordNormalized } from 'vue-router'
import { isActionConfig } from '@/types/typePredicates'
import { ActionConfig, ResultItem, ResultWithId } from '@/types'

export function assignIdsArray (store: ActionConfig[] | RouteRecordNormalized[] | (ActionConfig | RouteRecordNormalized)[]): ResultWithId[] {
  return store.map((item, idx) => {
    if (isActionConfig(item)) {
      return { id: idx, ...item }
    }
    return { id: idx, ...item }
  })
}

export function filterExcludedPaths (routes: RouteRecordNormalized[], excludedPaths: (string | RegExp)[])  {
  const regExps: RegExp[] = []
  const strings: string[] = []

  for (const e of excludedPaths) {
    if (typeof e === 'string') {
      strings.push(e)
    } else {
      regExps.push(e)
    }
  }

  return routes
    .filter(route =>  !strings.includes(route.path) && !regExps.some(regExp => regExp.test(route.path)))
}

export function sortAzByName (data: ResultWithId[]) {
  return data.sort((a, b) => {
    const nameA = String(a.name).toUpperCase() || ''
    const nameB = String(b.name).toUpperCase() || ''

    return nameA.localeCompare(nameB)
  })
}

export function transformDataToResultData (data: ResultWithId[]): ResultItem[] {
  return data.map(item => ({
    data: item,
    type: isActionConfig(item) ? 'action' : 'route'
  }))
}

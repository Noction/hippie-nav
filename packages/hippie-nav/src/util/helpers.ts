import { RouteRecordNormalized } from 'vue-router'
import { isActionConfig } from '@/types/typePredicates'
import { ActionConfig, ResultItem, ResultWithId } from '@/types'

export function assignIdsArray (store: (ActionConfig | RouteRecordNormalized)[]) {
  const storeWithIds: ResultWithId[] = store.map((item, idx) => {
    return { id: idx, ...item }
  })

  return storeWithIds
}

export function filterExcludedPaths (routes: RouteRecordNormalized[], excludedPaths: (string | RegExp)[])  {
  const regExps: RegExp[] = []
  const strings: string[] = []

  excludedPaths.forEach(e => {
    if (typeof e === 'string') {
      strings.push(e)
    } else {
      regExps.push(e)
    }
  })

  return routes
    .filter(route =>  !strings.includes(route.path) && !regExps.some(regExp => regExp.test(route.path)))
}

export function getValue<T extends object> (object: T, path: string) {
  if (path === undefined) return undefined

  return path
    .replace(/\[/g, '.')
    .replace(/\]/g, '')
    .split('.')
    .reduce((o, k) => (o || {})[k], object)
}

export function transformDataToResultData (data: ResultWithId[]) {
  const resultData: ResultItem[] = data.map(item => ({
    data: item,
    type: isActionConfig(item) ? 'action' : 'route'
  }))

  return resultData
}
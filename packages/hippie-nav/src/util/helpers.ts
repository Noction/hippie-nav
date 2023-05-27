import { RouteRecordNormalized } from 'vue-router'
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
    .filter(route => !strings.includes(route.path) && !regExps.some(regExp => regExp.test(route.path)))
}

export function filterHiddenRoutes (routes: RouteRecordNormalized[]) {
  return routes.filter(route => {
    const hidden= getValue(route, 'meta.hippieNavMeta.hidden') ?? getValue(route, 'meta.hidden')

    return !hidden
  })
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
    type: 'action' in item ? 'action' : 'route'
  }))

  return resultData
}
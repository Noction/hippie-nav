import { RouteRecordNormalized } from 'vue-router'

export const filterExcludedPaths = (routes: RouteRecordNormalized[], excludedPaths: (string | RegExp)[]) => {
  const regExps = [] as RegExp[]
  const strings = [] as string[]

  for (const e of excludedPaths) {
    if (e instanceof RegExp) {
      regExps.push(e)
    } else {
      strings.push(e)
    }
  }

  return routes
    .filter(route => !strings.includes(route.path))
    .filter(route => {
      for (const regExp of regExps) {
        if (regExp.test(route.path)) return false
      }
      return true
    })
}
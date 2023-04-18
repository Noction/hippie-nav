import { RouteRecordNormalized } from 'vue-router'

export const filterExcludedPaths = (routes: RouteRecordNormalized[], excludedPaths: (string | RegExp)[]) => {
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
    .filter(route => !strings.includes(route.path))
    .filter(route => {
      for (const regExp of regExps) {
        if (regExp.test(route.path)) return false
      }
      return true
    })
}
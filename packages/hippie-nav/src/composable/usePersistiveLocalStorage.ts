import { assignIdsArray } from '@/util/helpers'
import { isActionConfig } from '@/types/typePredicates'
import { transformDataToResultData } from '@/util/helpers'
import { ActionConfig, LocalStorageData, ResultItem } from '@/types'
import { Ref, onMounted, watch } from 'vue'
import { RouteRecordNormalized, useRouter } from 'vue-router'

export const HippieLocalStorage = 'hippieLocalStorage'

export function addLocalStorageRecentResults (recentResults: ResultItem[]): void {
  const localStorageData: LocalStorageData[] = recentResults.map(rs => {
    if (isActionConfig(rs.data)) return {  name: rs.data.name, type: 'action' }

    return {  name: rs.data.name, type: 'route' }
  })

  localStorage.setItem(HippieLocalStorage, JSON.stringify(localStorageData))
}

export function extractLocalStoreRecentResults (actions: ActionConfig[], routes: RouteRecordNormalized[]): ResultItem[] {
  const localStorageData: LocalStorageData[] | null = JSON.parse(localStorage.getItem(HippieLocalStorage))

  if (!Array.isArray(localStorageData)) return [] as ResultItem[]

  const recentResults: (ActionConfig | RouteRecordNormalized)[] = localStorageData.map(item => {
    if (item.type === 'action') {
      const index = actions.findIndex(action => action.name === item.name)

      return actions[index]
    }
    const index = routes.findIndex(route => route.name === item.name)

    return routes[index]
  })

  return transformDataToResultData(assignIdsArray(recentResults))
}

export function usePersistiveLocalStorage (recentResults: Ref<ResultItem[]>, actions: ActionConfig[]) {
  const router = useRouter()

  onMounted(() => {
    recentResults.value = extractLocalStoreRecentResults(actions, router.getRoutes())
  })

  watch([recentResults], () => {
    addLocalStorageRecentResults(recentResults.value)
  }, {
    deep: true
  })
}
import type { ActionConfig, LocalStorageData, ResultItem, UsePersistiveLocalStorage } from '@/types'
import type { Ref } from 'vue'
// import type { Ref } from 'vue-demi'
import type { RouteRecordNormalized } from 'vue-router'
import { assignIdsArray, transformDataToResultData } from '@/util/helpers'
import { useLocalStorage } from '@vueuse/core'
import { ref } from 'vue-demi'
import { useRouter } from 'vue-router'

export const HippieLocalStorageKey = 'hippieLocalStorage'

function addLocalStorageRecentResults(recentResults: ResultItem[]) {
  const localStorageData: LocalStorageData[] = recentResults.map((rs) => {
    if ('action' in rs.data)
      return { name: rs.data.name, type: 'action' }

    return { name: rs.data.name, type: 'route' }
  })

  localStorage.setItem(HippieLocalStorageKey, JSON.stringify(localStorageData))
}
function extractLocalStoreRecentResults(actions: ActionConfig[], routes: RouteRecordNormalized[]) {
  const localStorageData: LocalStorageData[] | null = JSON.parse(localStorage.getItem(HippieLocalStorageKey))

  if (!Array.isArray(localStorageData))
    return []

  const recentResults: (ActionConfig | RouteRecordNormalized)[] = localStorageData.map((item) => {
    if (item.type === 'action') {
      return actions.find(action => action.name === item.name)
    }

    return routes.find(route => route.name === item.name)
  })

  return transformDataToResultData(assignIdsArray(recentResults))
}

function addItem(result: ResultItem, recentResults: Ref<ResultItem[]>) {
  const idx = recentResults.value.findIndex((recentResult) => {
    if (recentResult.type !== result.type)
      return false

    return recentResult.data.name === result.data.name
  })

  if (~idx) {
    const elementZero = recentResults.value[idx]
    const filteredRecentResults = recentResults.value
      .filter(rs => rs.data.name !== elementZero.data.name)

    recentResults.value = [elementZero, ...filteredRecentResults]
      .map((result, idx): ResultItem => ({ ...result, data: { ...result.data, id: idx } }))
  }
  else {
    recentResults.value.unshift(result)

    if (recentResults.value.length > 3)
      recentResults.value.pop()
  }
  addLocalStorageRecentResults(recentResults.value)
}

function removeItem(resultItem: ResultItem, recentResults: Ref<ResultItem[]>) {
  recentResults.value = recentResults.value.filter(rs => rs.data.id !== resultItem.data.id)
  const localStorageData = useLocalStorage(HippieLocalStorageKey, '')
  const localStorageDataArray = JSON.parse(localStorageData.value)

  if (!Array.isArray(localStorageDataArray))
    return

  const recentResultsLocalStorage: LocalStorageData[] = localStorageDataArray.filter((item) => {
    if (item.type === resultItem.type) {
      return resultItem.data.name !== item.name
    }

    return true
  })

  localStorageData.value = JSON.stringify(recentResultsLocalStorage)
}

export function usePersistiveLocalStorage(actions: ActionConfig[]): UsePersistiveLocalStorage {
  const router = useRouter()
  const recentResults = ref(extractLocalStoreRecentResults(actions, router.getRoutes())) as Ref<ResultItem[]>

  return {
    addItem: (result) => { addItem(result, recentResults) },
    recentResults,
    removeItem: (resultItem) => { removeItem(resultItem, recentResults) },
  }
}

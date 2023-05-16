import { assignIdsArray } from '@/util/helpers'
import { isActionConfig } from '@/types/typePredicates'
import { transformDataToResultData } from '@/util/helpers'
import { useLocalStorage } from '@vueuse/core'
import { ActionConfig, LocalStorageData, ResultItem } from '@/types'
import { Ref, ref } from 'vue'
import { RouteRecordNormalized, useRouter } from 'vue-router'

export const HippieLocalStorageKey = 'hippieLocalStorage'

export interface UsePersistiveLocalStorage {
  addItem: (result: ResultItem) => void;
  recentResults: Ref<ResultItem[]>;
  removeItem: (index: number, resultItem: ResultItem) => void;
}

export function addLocalStorageRecentResults (recentResults: ResultItem[]) {
  const localStorageData: LocalStorageData[] = recentResults.map(rs => {
    if (isActionConfig(rs.data)) return {  name: rs.data.name, type: 'action' }

    return {  name: rs.data.name, type: 'route' }
  })

  localStorage.setItem(HippieLocalStorageKey, JSON.stringify(localStorageData))
}

export function extractLocalStoreRecentResults (actions: ActionConfig[], routes: RouteRecordNormalized[]): ResultItem[] {
  const localStorageData: LocalStorageData[] | null = JSON.parse(localStorage.getItem(HippieLocalStorageKey))

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

function addItem (result: ResultItem, recentResults: Ref<ResultItem[]>) {
  const idx = recentResults.value.findIndex(recentResult => {
    if (recentResult.type !== result.type) return false

    return recentResult.data.name === result.data.name
  })

  if (~idx) {
    const elementZero = recentResults.value[idx]
    const filteredRecentResults = recentResults.value.filter(rs => rs.data.id !== elementZero.data.id)

    recentResults.value = [elementZero, ...filteredRecentResults]
  } else {
    recentResults.value.unshift(result)
    if (recentResults.value.length > 3) recentResults.value.pop()
  }
  addLocalStorageRecentResults(recentResults.value)
}

function removeItem (resultIndex: number, resultItem: ResultItem, recentResults: Ref<ResultItem[]>) {
  recentResults.value = recentResults.value.filter((rs, idx) => idx !== resultIndex)
  const keyRef = useLocalStorage(HippieLocalStorageKey, '')

  const array = JSON.parse(keyRef.value)

  if (!Array.isArray(array)) return

  const recentResultsLocalStorage = array.filter(item => {
    if (item.type === resultItem.type) {
      return resultItem.data.name !== item.name
    }
    return true
  })

  keyRef.value = JSON.stringify(recentResultsLocalStorage)
}

export function usePersistiveLocalStorage ( actions: ActionConfig[]): UsePersistiveLocalStorage {
  const router = useRouter()
  const recentResults = ref(extractLocalStoreRecentResults(actions, router.getRoutes()))

  return {
    addItem: result => { addItem(result, recentResults) },
    recentResults,
    removeItem: (resultIndex, resultItem) => { removeItem(resultIndex, resultItem, recentResults) }
  }
}

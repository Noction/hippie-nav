import { Document } from 'flexsearch'
import { RouteRecordNormalized } from 'vue-router'
import { HippieNavConfig } from '../types'

export const useFlexSearch = (query: string, providedIndex: any, store: RouteRecordNormalized[]) => {

  const results = providedIndex.search(query)

  return results[0]?.result.map((id: number) => JSON.parse(JSON.stringify(store[id])))
}

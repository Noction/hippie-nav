import { RouteRecordNormalized } from 'vue-router'

export const useFlexSearch = (query: string, providedIndex: any, store: RouteRecordNormalized[]) => {

  const results = providedIndex.search(query)

  return results[0]?.result.map((id: number) => JSON.parse(JSON.stringify(store[id])))
}

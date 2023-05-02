import { RouteRecordNormalized } from 'vue-router'
import { isActionConfig } from '@/types/typePredicates'
import { ActionConfig,  ResultWithId } from '@/types'

export const assignIdsArray = (store: ActionConfig[] | RouteRecordNormalized[] | (ActionConfig | RouteRecordNormalized)[]): ResultWithId[] => {
  return store.map((item, idx) => {
    if (isActionConfig(item)) {
      return { id: idx, ...item }
    }
    return { id: idx, ...item }
  })
}
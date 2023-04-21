import { ActionConfig } from '@/types/interfaces'
import { RouteRecordNormalized } from 'vue-router'

export const isActionConfig = (value: RouteRecordNormalized | ActionConfig): value is ActionConfig => {
  return 'action' in value
}
import { IndexFields } from '../util/indexSetup'
import { RouteRecordNormalized } from 'vue-router'

export interface ActionConfig {
  name: string,
  action: () => void
  aliases: string[]
}

const isActionConfig = (value: RouteRecordNormalized | ActionConfig): value is ActionConfig => {
  return 'action' in value
}

export interface IndexOptionsHippieNav {
  charset: 'latin:extra',
  document: IndexFields,
  preset: 'match',
  tokenize: 'forward'
}

export interface ResultItem {
  type: 'route' | 'action',
  data: RouteRecordNormalized | ActionConfig
}
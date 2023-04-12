import { RouteRecordNormalized } from "vue-router"
import { IndexFields } from "../util/indexSetup"

export interface ActionConfig {
    name: string,
    action: () => void
    aliases: string[]
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
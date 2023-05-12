import { ActionConfig } from '@/types/interfaces'
import { RouteRecordNormalized } from 'vue-router'

export type Modifier = { [i: string]: { key: string, pressed: boolean } }
export type ResultWithId = {id: number} & (ActionConfig | RouteRecordNormalized )

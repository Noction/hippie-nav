import { RouteRecordNormalized } from 'vue-router'
import { ActionConfig, IndexOptionsHippieNav } from '@/types/interfaces'
import { Document, IndexOptionsForDocumentSearch } from 'flexsearch'

export type HippieIndex = Document<IndexOptionsForDocumentSearch<IndexOptionsHippieNav>>
export type LocalStorageData = {type: 'route' | 'action', name: string | RouteRecordNormalized['name']}
export type Modifier = { [i: string]: { key: string, pressed: boolean } }
export type ResultWithId = {id: number} & (ActionConfig | RouteRecordNormalized )
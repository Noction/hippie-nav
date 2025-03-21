import type { ActionConfig, IndexOptionsHippieNav } from '@/types/interfaces'
import type { Document, IndexOptionsForDocumentSearch } from 'flexsearch'
import type { RouteRecordNormalized } from 'vue-router'

export type HippieIndex = Document<IndexOptionsForDocumentSearch<IndexOptionsHippieNav>>
export type LocalStorageData = { type: 'route' | 'action', name: string | RouteRecordNormalized['name'] }
export type Modifier = { [i: string]: { key: string, pressed: boolean } }
export type ResultWithId = { id: number } & (ActionConfig | RouteRecordNormalized)

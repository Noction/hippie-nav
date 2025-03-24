import type { AppOptions } from '@/types'
import type { InjectionKey } from 'vue'
import PrivateHippieNav from './components/HippieNav.vue'

export const HippieNav = PrivateHippieNav

export const defaultOptions: AppOptions = {
  indexFields: {
    actions: ['name', 'aliases'],
    routes: ['path', 'name'],
  },
  resultsLimit: 7,
}

export const hippieNavOptions: InjectionKey<AppOptions> = Symbol('hippieNavOptions')

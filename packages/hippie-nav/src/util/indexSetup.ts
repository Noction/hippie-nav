import { Document } from 'flexsearch'
import { RouteRecordNormalized } from 'vue-router'

export const indexAdd = (index: Document<any>, routes: RouteRecordNormalized[]) => {
  routes.forEach((route: RouteRecordNormalized, idx: number) => {
    index.add({ id: idx, name: route.name, aliases: route.meta.aliases, path: route.path })
  })
}

export const indexSetup = (): Document<any> => {
  return new Document({
    preset: 'match',
    tokenize: 'full',
    document: {
      id: 'id',
      index: ['name', 'aliases', 'path']
    }
  })
}

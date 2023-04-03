import { Document } from 'flexsearch'
import { RouteRecordNormalized } from 'vue-router'

export const indexAdd = (index: Document<any>, routes: RouteRecordNormalized[]) => {
  routes.forEach((route: RouteRecordNormalized, idx: number) => {
    console.log(route.meta.aliases)
    index.add({ aliases: route.meta.aliases, id: idx,  name: route.name, path: route.path })
  })
}

export const indexSetup = (): Document<any> => {
  return new Document({
    document: {
      id: 'id',
      index: ['name', 'aliases', 'path']
    },
    preset: 'match',
    tokenize: 'full'
  })
}

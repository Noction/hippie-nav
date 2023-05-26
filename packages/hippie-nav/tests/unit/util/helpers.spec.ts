import { ActionConfig } from '@/types'
import { defineComponent } from 'vue'
import { rand } from '@vueuse/core'
import { RouteRecordNormalized, createRouter, createWebHistory } from 'vue-router'
import {
  assignIdsArray,
  filterExcludedPaths,
  filterHiddenRoutes,
  getValue,
  transformDataToResultData
} from '@/util/helpers'
import { describe, expect } from 'vitest'

const fakeComponent = defineComponent({
  name: 'FakeComponent',
  template: '<div>FakeComponent</div>'
})

const routes = [
  { component: fakeComponent, meta: { hidden: true }, path: '/about' },
  { component: fakeComponent, meta: { hidden: true }, path: '/home' },
  { component: fakeComponent, path: '/some' }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

const actions: ActionConfig[] = [
  { action: () => console.log(1), aliases: ['123', '123', '123'], name: 'action 1' },
  { action: () => console.log(1), aliases: ['123', '123', '123'], name: 'action 2' },
  { action: () => console.log(1), aliases: ['123', '123', '123'], name: 'action 3' }
]

describe('util `helpers`', () => {
  describe('assignIdsArray', () => {

    it('should receive given routes store with Ids', function () {
      const routesStore = router.getRoutes()

      const assignedWithIds = assignIdsArray(routesStore)

      expect(assignedWithIds[rand(0, 2)]).ownProperty('id')
    })

    it('should receive given actions store with Ids', function () {
      const actionsStore = actions

      const assignedWithIds = assignIdsArray(actionsStore)

      expect(assignedWithIds[rand(0, 2)]).ownProperty('id')
    })

    it('should receive given combined actions and routes store with Ids', function () {
      const actionsStore = actions
      const routeStore = router.getRoutes()
      const combinedStore = [...actionsStore, ...routeStore]

      const assignedWithIds = assignIdsArray(combinedStore)

      expect(assignedWithIds[rand(0, 5)]).ownProperty('id')
    })

    it('should receive an empty array', function () {
      const routesStore: RouteRecordNormalized[] = []

      const assignedWithIds = assignIdsArray(routesStore)

      expect(assignedWithIds).toHaveLength(0)
    })

  })

  describe('filterExcludedPaths', () => {
    it('should exclude given regexp paths from RecordNormalized[]', function () {
      const routesStore = router.getRoutes()
      const excludedPaths: RegExp[] = [new RegExp(`^${routesStore[1].path}`), new RegExp(`^${routesStore[2].path}`)]

      const filteredRoutes = filterExcludedPaths(routesStore, excludedPaths)

      expect(filteredRoutes).toStrictEqual([routesStore[0]])
    })

    it('should exclude given string paths from RecordNormalized[]', function () {
      const routesStore = router.getRoutes()
      const excludedPaths = [routesStore[0].path, routesStore[1].path]

      const filteredRoutes = filterExcludedPaths(routesStore, excludedPaths)

      expect(filteredRoutes).toStrictEqual([routesStore[2]])
    })

    it('should exclude given mixed excludedPaths from RecordNormalized[]', function () {
      const routesStore = router.getRoutes()
      const excludedPaths = [routesStore[0].path, new RegExp(`^${routesStore[1].path}`)]

      const filteredRoutes = filterExcludedPaths(routesStore, excludedPaths)

      expect(filteredRoutes).toStrictEqual([routesStore[2]])
    })
  })

  describe('getValue', () => {
    it('should get value b of object ', function () {
      const object = { a: { b: 'foo' } }

      const value = getValue(object, 'a.b')

      expect(value).toEqual('foo')
    })
  })

  it('should get undefined', function () {
    const object = { a: { b: 'foo' } }

    const value = getValue(object, 'a.c')

    expect(value).toEqual(undefined)
  })

  describe('transformDataToResultData', () => {
    it('should transform routes ResultWithId[] to ResultData[]', function () {
      const routesWithIds = assignIdsArray(router.getRoutes())

      const results = transformDataToResultData(routesWithIds)

      expect(results[rand(0, routesWithIds.length -1 )]).toHaveProperty('type')
    })

    it('should transform actions ResultWithId[] to ResultData[]', function () {
      const actionsWithIds = assignIdsArray(actions)

      const results = transformDataToResultData(actionsWithIds)

      expect(results[rand(0, actionsWithIds.length -1 )]).toHaveProperty('type')
    })

    it('should transform mixed ResultWithId[] to ResultData[]', function () {
      const routesWithIds = assignIdsArray(router.getRoutes())
      const actionsWithIds = assignIdsArray(actions)
      const mixedWithIds = routesWithIds.concat(actionsWithIds)

      const results = transformDataToResultData(mixedWithIds)

      expect(results[rand(0, mixedWithIds.length -1 )]).toHaveProperty('type')
    })
  })

  describe('filterHiddenRoutes', () => {
    it('should have as result one route', function () {
      const filteredRoutes = filterHiddenRoutes(router.getRoutes())

      expect(filteredRoutes).toHaveLength(1)
    })
  })
})

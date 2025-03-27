import { ActionConfig } from '@/types'
import { defineComponent } from 'vue'
import { rand } from '@vueuse/core'
import { usePersistiveLocalStorage } from '@/composable/usePersistiveLocalStorage'
import { VueWrapper, mount } from '@vue/test-utils'
import { afterEach, beforeEach, expect } from 'vitest'
import { assignIdsArray, transformDataToResultData } from '@/util/helpers'
import { createRouter, createWebHistory } from 'vue-router'

const actions: ActionConfig[] = [
  { action: () => undefined, aliases: ['123', '123', '123'], name: 'action 1' },
  { action: () => undefined, aliases: ['123', '123', '123'], name: 'action 2' },
  { action: () => undefined, aliases: ['123', '123', '123'], name: 'action 3' }
]

const FakeComponent = defineComponent({
  name: 'FakeComponent',
  template: '<div>FakeComponent</div>'
})

const routes = [
  { component: FakeComponent, path: '/' },
  { component: FakeComponent, path: '/about' },
  { component: FakeComponent, path: '/home' },
  { component: FakeComponent, path: '/some' }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

const MainComponent = defineComponent({
  name: 'MainComponent',
  setup () {
    const { recentResults, addItem, removeItem } = usePersistiveLocalStorage(actions)

    return { addItem, recentResults, removeItem  }
  },
  template: '<div>MainComponent</div>'
})

describe('usePersistiveLocalStorage', () => {
  let wrapper: VueWrapper<InstanceType<typeof MainComponent>>
  const actionsWithId = assignIdsArray(actions)
  const routesWithId = assignIdsArray(router.getRoutes())
  const resultsWithId = transformDataToResultData(actionsWithId.concat(routesWithId))

  afterEach(() => {
    window.localStorage.clear()
    wrapper.unmount()
  })

  beforeEach(() => {
    wrapper = mount(MainComponent, {
      global: {
        plugins: [router]
      }
    })
  })

  it('should add one item to recentResults', function () {
    const itemToAdd = resultsWithId[rand(0, resultsWithId.length -1)]

    wrapper.vm.addItem(itemToAdd)

    expect(wrapper.vm.recentResults).toEqual(expect.arrayContaining([itemToAdd]))
  })

  it('should add two item to recentResults', function () {
    const itemsToAdd = [resultsWithId[0], resultsWithId[3]]

    wrapper.vm.addItem(itemsToAdd[0])
    wrapper.vm.addItem(itemsToAdd[1])

    expect(wrapper.vm.recentResults).toHaveLength(2)
  })

  it('should remove one item from recentResult', function () {
    wrapper.vm.addItem(resultsWithId[3])
    wrapper.vm.addItem(resultsWithId[5])

    wrapper.vm.removeItem( resultsWithId[3])

    expect(wrapper.vm.recentResults).not.contain(resultsWithId[3])
  })

  it('should not have recentResults length more than 3', function () {
    const itemsToAdd = [resultsWithId[0], resultsWithId[1], resultsWithId[2], resultsWithId[3]]

    itemsToAdd.forEach(item => wrapper.vm.addItem(item))

    expect(wrapper.vm.recentResults).toHaveLength(3)
  })

  it('should remove all recentResults', function () {
    const itemsToAdd = [resultsWithId[0], resultsWithId[1], resultsWithId[2]]

    itemsToAdd.forEach(item => wrapper.vm.addItem(item))
    wrapper.vm.recentResults.forEach(async item => await wrapper.vm.removeItem(item))

    expect(wrapper.vm.recentResults).toHaveLength(0)
  })
})

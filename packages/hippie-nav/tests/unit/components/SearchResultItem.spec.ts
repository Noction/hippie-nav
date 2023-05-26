import SearchResultItem from '@/components/SearchResultItem.vue'
import { defineComponent } from 'vue'
import { assignIdsArray, transformDataToResultData } from '@/util/helpers'
import { createRouter, createWebHistory } from 'vue-router'
import { enableAutoUnmount, shallowMount } from '@vue/test-utils'

const AppComponent = defineComponent({
  name: 'AppComponent',
  template: '<div/>'
})

const router = createRouter({
  history: createWebHistory(),
  routes: [{
    component: AppComponent,
    name: 'Main page',
    path: '/'
  }]
})

describe('SearchResultItem component', () => {
  enableAutoUnmount(afterEach)

  it('should have removeButton', function () {
    const [resulItem] = transformDataToResultData(assignIdsArray(router.getRoutes()))
    const wrapper = shallowMount(SearchResultItem, {
      props: {
        isRecentResult: true,
        options: {},
        result: resulItem,
        searchInput: ''
      }
    })
    const button = wrapper.find('.clear-btn')

    expect(button.exists()).toBe(true)
  })

  it('should not have removeButton', function () {
    const [resulItem] = transformDataToResultData(assignIdsArray(router.getRoutes()))
    const wrapper = shallowMount(SearchResultItem, {
      props: {
        isRecentResult: false,
        options: {},
        result: resulItem,
        searchInput: ''
      }
    })
    const button = wrapper.find('.clear-btn')

    expect(button.exists()).toBe(false)
  })

  it('should emit mouseOver', async function () {
    const [resulItem] = transformDataToResultData(assignIdsArray(router.getRoutes()))
    const wrapper = shallowMount(SearchResultItem, {
      props: {
        isRecentResult: false,
        options: {},
        result: resulItem,
        searchInput: ''
      }
    })

    await wrapper.trigger('mouseover')

    expect(wrapper.emitted().mouseOver).toHaveLength(1)
  })

  it('should emit mouseOut', async function () {
    const [resulItem] = transformDataToResultData(assignIdsArray(router.getRoutes()))
    const wrapper = shallowMount(SearchResultItem, {
      props: {
        isRecentResult: false,
        options: {},
        result: resulItem,
        searchInput: ''
      }
    })

    await wrapper.trigger('mouseout')

    expect(wrapper.emitted().mouseOut).toHaveLength(1)
  })

  it('should emit removeResult', async function () {
    const [resulItem] = transformDataToResultData(assignIdsArray(router.getRoutes()))
    const wrapper = shallowMount(SearchResultItem, {
      props: {
        isRecentResult: true,
        options: {},
        result: resulItem,
        searchInput: ''
      }
    })
    const button = wrapper.find('.clear-btn')

    await button.trigger('click')

    expect(wrapper.emitted().removeRecentResult).toHaveLength(1)
  })

})

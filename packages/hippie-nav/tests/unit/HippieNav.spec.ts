import { HippieNav } from '@/index'
import SearchPan from '@/components/SearchPan.vue'
import simulateShortcut from '../utils/simulateShorcut'
import { VueWrapper, enableAutoUnmount, mount } from '@vue/test-utils'
import { afterEach, beforeEach, describe, expect } from 'vitest'
import { createRouter, createWebHistory } from 'vue-router'
import { defineComponent, nextTick } from 'vue'

const AppComponent = defineComponent({
  name: 'AppComponent',
  components: { HippieNav },
  template: '<div><hippie-nav/></div>'
})

const router = createRouter({
  history: createWebHistory(),
  routes: [{
    component: AppComponent,
    name: 'Main page',
    path: '/'
  }, {
    component: AppComponent,
    name: 'Home Page',
    path: '/home'
  }, {
    component: AppComponent,
    name: 'About page',
    path: '/about'
  }]
})

describe('HippieNav component', () => {
  let wrapper: VueWrapper<InstanceType<typeof AppComponent>>

  beforeEach(() => {
    wrapper = mount(AppComponent, {
      global: {
        plugins: [router]
      }
    })
  })

  enableAutoUnmount(afterEach)

  describe('shortcut', function () {
    it('should open on meta+K', async function () {
      const hippieNav = wrapper.findComponent(HippieNav)

      simulateShortcut('Meta', 'k')

      expect(hippieNav.vm.showModal).toBe(true)
    })

    it('should open on meta+K', async function () {
      const hippieNav = wrapper.findComponent(HippieNav)

      simulateShortcut('Control', 'k')

      expect(hippieNav.vm.showModal).toBe(true)
    })

    it('should not open on meta+P', async function () {
      const hippieNav = wrapper.findComponent(HippieNav)

      simulateShortcut('Meta', 'P')

      expect(hippieNav.vm.showModal).toBe(false)
    })
  })

  describe('searchPan', () => {
    it('should have one item in results', async function () {
      simulateShortcut('Meta', 'k')
      await nextTick()
      const hippieNav = wrapper.getComponent(HippieNav)
      const searchPan = wrapper.getComponent(SearchPan)
      const input = searchPan.get({ ref: 'input' })

      await input.setValue('Home')

      expect(hippieNav.vm.results).toHaveLength(1)
    })

    it('should have three items in results', async function () {
      simulateShortcut('Meta', 'k')
      await nextTick()
      const hippieNav = wrapper.getComponent(HippieNav)
      const searchPan = wrapper.getComponent(SearchPan)
      const input = searchPan.get({ ref: 'input' })

      await input.setValue('Page')

      expect(hippieNav.vm.results).toHaveLength(3)
    })
  })

})

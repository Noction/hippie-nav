import { HippieNav } from '@/index'
import SearchPan from '@/components/SearchPan.vue'
import simulateShortcut from '../utils/simulateShorcut'
import { createRouter, createWebHistory } from 'vue-router'
import { defineComponent, nextTick } from 'vue-demi'
import { enableAutoUnmount, mount } from '@vue/test-utils'

const AppComponent = defineComponent({
  name: 'AppComponent',
  components: { HippieNav },
  template: '<div><hippie-nav/></div>'
})

const router = createRouter({
  history: createWebHistory(),
  routes: [{
    component: AppComponent,
    name: 'Main Page',
    path: '/'
  }, {
    component: AppComponent,
    name: 'Home Page',
    path: '/home'
  }, {
    component: AppComponent,
    name: 'About Page',
    path: '/about'
  }]
})

describe('HippieNav', () => {

  enableAutoUnmount(afterEach)
  afterEach(() => {
    window.localStorage.clear()
  })

  describe('shortcut', function () {
    it('should open on meta+K', async function () {
      const wrapper = mount(AppComponent, { global: { plugins: [router] } })
      const hippieNav = wrapper.findComponent(HippieNav)

      simulateShortcut('Meta', 'k')

      expect((hippieNav.vm as any).showModal).toBe(true)
    })

    it('should open on meta+K', async function () {
      const wrapper = mount(AppComponent, { global: { plugins: [router] } })
      const hippieNav = wrapper.findComponent(HippieNav)

      simulateShortcut('Control', 'k')

      expect((hippieNav.vm as any).showModal).toBe(true)
    })

    it('should not open on meta+P', async function () {
      const wrapper = mount(AppComponent, { global: { plugins: [router] } })
      const hippieNav = wrapper.findComponent(HippieNav)

      simulateShortcut('Meta', 'P')

      expect((hippieNav.vm as any).showModal).toBe(false)
    })
  })

  it('should open by function openModal', async function () {
    const wrapper = mount(AppComponent, { global: { plugins: [router] } })
    const hippieNav = wrapper.findComponent(HippieNav)

    if (hippieNav.vm.openModal) (hippieNav.vm as any).openModal()

    expect((hippieNav.vm as any).showModal).toBe(true)
  })

  describe('searchPan', () => {
    it('should have one item in results', async function () {
      const wrapper = mount(AppComponent, { global: { plugins: [router] } })

      simulateShortcut('Meta', 'k')
      await nextTick()
      const hippieNav = wrapper.getComponent(HippieNav)
      const searchPan = wrapper.getComponent(SearchPan)
      const input = searchPan.get({ ref: 'input' })

      await input.setValue('Home')

      expect((hippieNav.vm as any).results ).toHaveLength(1)
    })

    it('should have three items in results', async function () {
      const wrapper = mount<typeof AppComponent>(AppComponent, { global: { plugins: [router] } })

      simulateShortcut('Meta', 'k')
      await nextTick()
      const hippieNav = wrapper.getComponent(HippieNav)
      const searchPan = wrapper.getComponent(SearchPan)
      const input = searchPan.get({ ref: 'input' })

      await input.setValue('Page')

      expect((hippieNav.vm as any).results).toHaveLength(3)
    })
  })

  describe('recentResults', () => {
    it('should add one item', async function () {
      const wrapper = mount(AppComponent, { global: { plugins: [router] } })

      simulateShortcut('Meta', 'k')

      await nextTick()

      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      //@ts-ignore
      wrapper.getComponent(HippieNav).vm.searchInput = 'Page'

      await nextTick()
      const results = wrapper.findAll('[data-test="results"]')
      const resultContent = results[0].find('.hippie-result-item-content')

      await resultContent.trigger('click')

      simulateShortcut('Meta', 'k')
      await nextTick()
      const recentResults = wrapper.findAll('[data-test="recentResults"]')

      expect(recentResults.length).toBe(1)
    })

    it('should remove one item', async function () {
      localStorage.setItem('hippieLocalStorage', JSON.stringify([{ name: 'Main Page', type: 'route' }]))
      const wrapper = mount(AppComponent, { global: { plugins: [router] } })

      simulateShortcut('Meta', 'k')

      await nextTick()

      const recentResults = wrapper.findAllComponents('[data-test="recentResults"]')
      const removeButton = recentResults[0].find('.clear-btn')

      await removeButton.trigger('click')

      expect((wrapper.getComponent(HippieNav).vm as any).recentResults).toHaveLength(0)
    })
  })

})

import { HippieNav } from '@/index'
import { describe, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import { defineComponent } from 'vue'
import { createRouter, createWebHistory } from 'vue-router'

const AppComponent = defineComponent({
  name: 'AppComponent',
  components: { HippieNav },
  template: '<template><hippie-nav/></template>'
})

const router = createRouter({
  history: createWebHistory(),
  routes: [{
    component: AppComponent,
    name: 'Hippie',
    path: '/'
  }]
})

describe('HippieNav component', () => {
  it('should open on meta+K', async function () {

    const wrapper = mount(AppComponent, {
      global: {
        plugins: [router]
      }
    })

    const hippieNav = wrapper.findComponent(HippieNav)

    await hippieNav.trigger('keydown', { key: 'meta' })
    await hippieNav.trigger('keydown', { key: 'k' })

    expect(hippieNav.vm.showModal).toBeTruthy()
  })
})
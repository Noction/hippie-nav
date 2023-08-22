import SearchPan from '@/components/SearchPanel.vue'
import { expect } from 'vitest'
import { enableAutoUnmount, shallowMount } from '@vue/test-utils'

describe('SearchPan component', () => {
  enableAutoUnmount(afterEach)

  it('should emit update:model-value', async function () {
    const wrapper = shallowMount(SearchPan, {
      props: {
        modelValue: ''
      }
    })
    const input = wrapper.find({ ref: 'input' })

    await input.setValue('hello world')

    expect(wrapper.emitted()).toHaveProperty('update:model-value')
  })

  it('should emit close', async function () {
    const wrapper = shallowMount(SearchPan, {
      props: {
        modelValue: ''
      }
    })
    const input = wrapper.find({ ref: 'input' })

    await input.trigger('keydown.esc')

    expect(wrapper.emitted()).toHaveProperty('close')
  })

  it('should emit next', async function () {
    const wrapper = shallowMount(SearchPan, {
      props: {
        modelValue: ''
      }
    })
    const input = wrapper.find({ ref: 'input' })

    await input.trigger('keydown.down')

    expect(wrapper.emitted()).toHaveProperty('next')
  })

  it('should emit next on tab', async function () {
    const wrapper = shallowMount(SearchPan, {
      props: {
        modelValue: ''
      }
    })
    const input = wrapper.find({ ref: 'input' })

    await input.trigger('keydown.tab')

    expect(wrapper.emitted()).toHaveProperty('next')
  })

  it('should emit previous', async function () {
    const wrapper = shallowMount(SearchPan, {
      props: {
        modelValue: ''
      }
    })
    const input = wrapper.find({ ref: 'input' })

    await input.trigger('keydown.up')

    expect(wrapper.emitted()).toHaveProperty('previous')
  })

  it('should emit goto', async function () {
    const wrapper = shallowMount(SearchPan, {
      props: {
        modelValue: ''
      }
    })
    const input = wrapper.find({ ref: 'input' })

    await input.trigger('keydown.enter')

    expect(wrapper.emitted()).toHaveProperty('goto')
  })

  it('should emit update:model-value to clear input', async function () {
    const wrapper = shallowMount(SearchPan, {
      props: {
        modelValue: 'test'
      }
    })
    const button = await wrapper.find('.clear-btn')

    await button.trigger('click')

    expect(wrapper.emitted()['update:model-value'][0]).toStrictEqual([''])
  })

  it('should have crosshair button', async function () {
    const wrapper = shallowMount(SearchPan, {
      props: {
        modelValue: 'test'
      }
    })

    const button = await wrapper.find('.clear-btn')

    expect(button.exists()).toBeTruthy()
  })

  it('should not have crosshair button', async function () {
    const wrapper = shallowMount(SearchPan, {
      props: {
        modelValue: ''
      }
    })
    const button = await wrapper.find('.clear-btn')

    expect(button.exists()).toBeFalsy()
  })

  it('should have input maxLength 39', async function () {
    const wrapper = shallowMount(SearchPan, {
      props: {
        modelValue: ''
      }
    })
    const input = wrapper.find({ ref: 'input' })

    expect(input.attributes('maxlength')).toBe('39')
  })
})

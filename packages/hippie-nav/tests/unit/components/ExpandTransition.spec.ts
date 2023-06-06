import ExpandTransition from '@/components/ExpandTransition.vue'
import { defineComponent } from 'vue-demi'
import { mount } from '@vue/test-utils'

const component = defineComponent({
  name: 'HelloWorld',
  components: {
    ExpandTransition
  },
  template: '<div><ExpandTransition><svg/></ExpandTransition></div>'
})

describe('ExpandTransition', () => {
  it('should throw a error if given Element is not HTMLElement on enter', function () {
    const wrapper = mount(component)

    const element= wrapper.findComponent(ExpandTransition)

    expect(() => { (element.vm as any).enter() }).toThrowError(new Error('Element should be HTMLElement'))
  })

  it('should throw a error if given Element is not HTMLElement on leave', function () {
    const wrapper = mount(component)

    const element= wrapper.findComponent(ExpandTransition)

    expect(() => { (element.vm as any).leave() }).toThrowError(new Error('Element should be HTMLElement'))
  })

  it('should throw a error if given Element is not HTMLElement on afterEnter', function () {
    const wrapper = mount(component)

    const element= wrapper.findComponent(ExpandTransition)

    expect(() => { (element.vm as any).leave() }).toThrowError(new Error('Element should be HTMLElement'))
  })
})

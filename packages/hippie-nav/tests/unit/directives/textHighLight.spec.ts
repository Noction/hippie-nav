import { defineComponent } from 'vue'
import { faker } from '@faker-js/faker'
import textHighlight from '@/directives/textHighlight'
import { VueWrapper, enableAutoUnmount, shallowMount } from '@vue/test-utils'

const component = defineComponent({
  name: 'TextHighLight',
  directives: {
    textHighlight
  },
  data () {
    return {
      keyword: '',
      text: ''
    }
  },
  template: `<div>
    <p v-text-highlight="{ keyword }" data-test="highlightedParagraph">
      {{ text }}
    </p>
  </div>`
})

const highlightedSpan = (keyword: string) => {
  return `<span class="highlighted">${keyword}</span>`
}

const HIGHLIGHTED_PARAGRAPH = '[data-test="highlightedParagraph"]'

describe('textHighlight directive', () => {
  let wrapper = <VueWrapper>{}

  enableAutoUnmount(afterEach)
  beforeEach(() => {
    wrapper = shallowMount(component)
  })

  it('should contain highlighted span partial', async () => {
    const text = faker.lorem.word()
    const keyword =  text.slice(0, text.length / 2)

    await wrapper.setData({ text })
    await wrapper.setData({ keyword })

    expect(wrapper.find(HIGHLIGHTED_PARAGRAPH).html()).toContain(highlightedSpan(keyword))
  })

  it('should contain highlighted span partial, after two changes of keyword', async () => {
    const text = faker.lorem.word()
    const keywords =  [text.slice(0, text.length / 2), text.slice(0, text.length - 1)]

    await wrapper.setData({ text })
    await wrapper.setData({ keyword: keywords[0] })
    await wrapper.setData({ keyword: keywords[1] })

    expect(wrapper.find(HIGHLIGHTED_PARAGRAPH).html()).toContain(highlightedSpan(keywords[1]))
  })

  it('should contain highlighted span full', async () => {
    const text = faker.lorem.word()

    await wrapper.setData({ text })
    await wrapper.setData({ keyword: text })

    expect(wrapper.find(HIGHLIGHTED_PARAGRAPH).html()).toContain(highlightedSpan(text))
  })

  it('should not contain highlighted span, no keyword', async () => {
    await wrapper.setData({ text: faker.lorem.word() })
    const keyword = ''

    await wrapper.setData({ keyword })

    expect(wrapper.find(HIGHLIGHTED_PARAGRAPH).html()).not.toContain(highlightedSpan(keyword))
  })

  it('should not contain highlighted span, text does not contain the keyword', async () => {
    await wrapper.setData({ text: faker.lorem.word() })
    const keyword = faker.lorem.word(+faker.random.numeric())

    await wrapper.setData({ keyword })

    expect(wrapper.find(HIGHLIGHTED_PARAGRAPH).html()).not.toContain(highlightedSpan(keyword))
  })
})

import { defineComponent } from 'vue-demi'
import { faker } from '@faker-js/faker'
import textHighlight from '@/directives/textHighlight'
import { VueWrapper, shallowMount } from '@vue/test-utils'

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
    <span v-text-highlight="{ keyword }" data-test="highlightedParagraph" v-text="text"/>
  </div>`
})

const highlightedSpan = (keyword: string) => {
  return `<span class="highlighted" style="text-decoration: underline">${keyword}</span>`
}

const HIGHLIGHTED_PARAGRAPH = '[data-test="highlightedParagraph"]'

describe('textHighlight directive', () => {
  let wrapper = <VueWrapper>{}

  beforeEach(() => {
    wrapper = shallowMount(component)
  })

  afterEach(() => {
    wrapper.unmount()
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

    const html = wrapper.find(HIGHLIGHTED_PARAGRAPH).html()
    const toBe = highlightedSpan(keywords[1])

    expect(html).toContain(toBe)
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
    await wrapper.setData({ text: faker.string.fromCharacters('a') })
    const keyword = faker.string.fromCharacters('b')

    await wrapper.setData({ keyword })

    expect(wrapper.find(HIGHLIGHTED_PARAGRAPH).html()).not.toContain(highlightedSpan(keyword))
  })
})

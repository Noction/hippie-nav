import { DirectiveBinding, VNode, onBeforeUnmount, onMounted  } from 'vue'
const replaceWithOriginal = (original: string, newText: string) => `<p style="display:none;">${original}</p>${newText}`

declare global {
  interface HTMLElement {
    beforeHighlight: () => void;
  }
}
const escapeHtml = (unsafe: string) => unsafe
  .replace(/&/g, '&amp;')
  .replace(/</g, '&lt;')
  .replace(/>/g, '&gt;')
  .replace(/"/g, '&quot;')
  .replace(/'/g, '&#039;')
const escapeRegExp = function (str: string) {
  // eslint-disable-next-line
  return str.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|\<\>]/g, '\\$&')
}

const highlightSearch = function (message: string, keyword: string) {
  const styleString = 'style="text-decoration: underline"'
  const newKeyword = keyword
  let regexWord = ''

  if (/^\s*$/.test(keyword)) {
    // when the keyword is empty string, return the original message.
    return escapeHtml(message)
  }
  regexWord = escapeRegExp(newKeyword)

  // const match = new RegExp(`(${regexWord})`, flags)
  // Can only replace the words out of the html tags.
  const match = new RegExp(`(${regexWord})`, 'gi')
  const testMath = match.test(message)

  if (testMath) {
    // return escapeHtml(message).replace(match, `<span ${styleString}>\$&</span>`)
    // eslint-disable-next-line
    const replaced = message.replace(match, ':;{{:;\$&:;}}:;')
    const matchAgain = new RegExp(`:;{{:;(${escapeHtml(regexWord)}):;}}:;`, 'gi')
    // eslint-disable-next-line
    return escapeHtml(replaced).replace(matchAgain, `<span class="hippie-highlighted" ${styleString}>\$1</span>`)
  }
  return escapeHtml(message)
}

export default {
  mounted (el: HTMLElement, binding: DirectiveBinding) {
    const originalString = `${el.innerHTML}`

    el.innerHTML = replaceWithOriginal(originalString, originalString)
    const beforeHighlight = () => {
      const {
        value: { keyword }
      } = binding

      if (!keyword || keyword === '') {
        const escaseOriginal = escapeHtml(originalString)

        el.innerHTML = replaceWithOriginal(escaseOriginal, escaseOriginal)
        return
      }

      const highlight = highlightSearch(originalString, keyword)

      el.innerHTML = replaceWithOriginal(escapeHtml(originalString), highlight)
    }

    beforeHighlight()

    onMounted(() => {
      el.beforeHighlight = beforeHighlight
    })

    onBeforeUnmount(() => {
      el.innerHTML = el.children[0].innerHTML
    })
  },
  updated (el: HTMLElement, binding: DirectiveBinding, vnode: VNode) {
    if (vnode.children !== null) {
      const originalString = escapeHtml(vnode.children[0].text)

      el.innerHTML = replaceWithOriginal(originalString, originalString)
      el.beforeHighlight()
    }
  }
}

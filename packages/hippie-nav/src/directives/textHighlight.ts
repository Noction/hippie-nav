import { VNode } from 'vue-demi'

const replaceWithOriginal = (original: string, newText: string) => `<span style="display:none;">${original}</span>${newText}`

const escapeRegExp = (str: string) => str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')

function escapeHtml (unsafe: string) {
  return unsafe
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;')
}

function unescapeHtml (safe: string) {
  return safe
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#039;/g, '\'')
}

const highlightSearch = function (message: string, keyword: string) {
  const styleString = 'style="text-decoration: underline"'
  const newKeyword = keyword
  let regexWord = ''

  if (typeof keyword === 'string') {
    if (/^\s*$/.test(keyword)) { return escapeHtml(message) }

    regexWord = escapeRegExp(newKeyword)
  } else {
    return escapeHtml(message)
  }

  const match = new RegExp(`(${regexWord})`, 'gi')
  const testMath = match.test(message)

  if (testMath) {

    const replaced = message.replace(match, ':;{{:;$&:;}}:;')
    const matchAgain = new RegExp(`:;{{:;(${escapeHtml(regexWord)}):;}}:;`, 'gi')

    return escapeHtml(replaced).replace(matchAgain, `<span class="highlighted" ${styleString}>$1</span>`)
  }

  return escapeHtml(message)
}

const beforeHighlight = (el: Element, binding: { value: { keyword: string }}, original: string) => {
  const { value: { keyword } } = binding

  if (!keyword || keyword === '') {
    const escaseOriginal = escapeHtml(original)

    el.innerHTML = replaceWithOriginal(escaseOriginal, escaseOriginal)
    return
  }

  const highlight = highlightSearch(original, keyword)

  el.innerHTML = replaceWithOriginal(escapeHtml(original), highlight)
}

export default {
  mounted (el: Element, binding: { value: { keyword: string }}) {
    const originalString = `${el.innerHTML}`

    el.innerHTML = replaceWithOriginal(originalString, originalString)
    beforeHighlight(el, binding, unescapeHtml(originalString))
  },
  unmounted (el: Element) {
    el.innerHTML = el.children[0].innerHTML
  },
  updated (el: Element, binding: { value: { keyword: string }}, vnode: VNode) {
    const originalString = escapeHtml(vnode.props.textContent)

    el.innerHTML = replaceWithOriginal(originalString, originalString)
    beforeHighlight(el, binding, unescapeHtml(originalString))
  }
}

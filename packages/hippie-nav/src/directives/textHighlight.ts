import { Directive, VNode } from 'vue'
/* eslint-disable */
const replaceWithOriginal = (original: string, newText: string) => `<p style="display:none;">${original}</p>${newText}`

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

function escapeRegExp (str: string) {
  return str.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|\<\>]/g, '\\$&')
}

function highlightSearch (message: string, keyword: string) {
  const styleString = 'style="text-decoration: underline"'
  const newKeyword = keyword
  let regexWord = ''

  if (typeof keyword === 'string') {
    if (/^\s*$/.test(keyword)) {
      return escapeHtml(message)
    }
    regexWord = escapeRegExp(newKeyword)
  } else {
    console.warn('type is not String')
    // return ''
    return escapeHtml(message)
  }

  const match = new RegExp(`(${regexWord})`, 'gi')
  const testMath = match.test(message)

  if (testMath) {
    const replaced = message.replace(match, ':;{{:;\$&:;}}:;')
    const matchAgain = new RegExp(`:;{{:;(${escapeHtml(regexWord)}):;}}:;`, 'gi')

    const restoreReplaced = escapeHtml(replaced).replace(matchAgain, `<span class="highlighted" ${styleString}>\$1</span>`)

    return restoreReplaced
  }
  return escapeHtml(message)
}

const beforeHighlight = (el: Element, binding: { value: { keyword: string }}, original: string) => {
  const {
    value: { keyword }
  } = binding

  if (!keyword || keyword === '') {
    const escaseOriginal = escapeHtml(original)

    el.innerHTML = replaceWithOriginal(escaseOriginal, escaseOriginal)
    return
  }

  const highlight = highlightSearch(original, keyword)

  el.innerHTML = replaceWithOriginal(escapeHtml(original), highlight)
}

interface HighlightSearchDirective {
  mounted: (el: Element, binding: { value: { keyword: string } }) => void
  updated: (el: Element, binding: { value: { keyword: string } }, vnode: VNode) => void
  unmounted: (el: Element) => void
}
const textHighlight: HighlightSearchDirective & Directive =  {
  mounted (el: Element, binding: { value: { keyword: string }}) {
    const originalString = `${el.innerHTML}`

    el.innerHTML = replaceWithOriginal(originalString, originalString)
    beforeHighlight(el, binding, unescapeHtml(originalString))
  },
  unmounted (el: Element) {
    el.innerHTML = el.children[0].innerHTML
  },
  updated (el: Element, binding: { value: { keyword: string }}, vnode: VNode) {
    const originalString = vnode.children[0].el.textContent

    el.innerHTML = replaceWithOriginal(originalString, originalString)
    beforeHighlight(el, binding, unescapeHtml(originalString))
  }

}

export default textHighlight
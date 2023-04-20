import { onBeforeUnmount, onMounted } from 'vue'

const replaceWithOriginal = (original, newText) => `<p style="display:none;">${original}</p>${newText}`

const escapeHtml = unsafe => unsafe
  .replace(/&/g, '&amp;')
  .replace(/</g, '&lt;')
  .replace(/>/g, '&gt;')
  .replace(/"/g, '&quot;')
  .replace(/'/g, '&#039;')

const unescapeHtml = safe => safe
  .replace(/&amp;/g, '&')
  .replace(/&lt;/g, '<')
  .replace(/&gt;/g, '>')
  .replace(/&quot;/g, '"')
  .replace(/&#039;/g, '\'')

const escapeRegExp = function (str) {
  // eslint-disable-next-line
  return str.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|\<\>]/g, '\\$&')
}

const highlightSearch = function (message, keyword) {
  const styleString = 'style="text-decoration: underline"'
  const newKeyword = keyword
  let regexWord = ''

  if (typeof keyword === 'string') {
    if (/^\s*$/.test(keyword)) {
      // when the keyword is empty string, return the original message.
      return escapeHtml(message)
    }
    regexWord = escapeRegExp(newKeyword)
  } else {
    console.warn('type is not String')
    // return ''
    return escapeHtml(message)
  }

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
    const restoreReplaced = escapeHtml(replaced).replace(matchAgain, `<span class="hippie-highlighted" ${styleString}>\$1</span>`)

    return restoreReplaced
  }
  return escapeHtml(message)
}

export default {
  mounted (el, binding) {
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
  updated (el, binding, vnode) {
    const originalString = escapeHtml(vnode.children[0].text)

    el.innerHTML = replaceWithOriginal(originalString, originalString)
    el.beforeHighlight()
  }
}

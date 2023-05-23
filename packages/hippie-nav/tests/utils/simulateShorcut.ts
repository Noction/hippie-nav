function blurPressedKeys (firstKey: string, secondKey: string) {
  window.dispatchEvent(new KeyboardEvent('blur', { key: firstKey }))
  window.dispatchEvent(new KeyboardEvent('blur', { key: secondKey }))
}

function simulateShortcut (firstKey: string, secondKey: string) {
  window.dispatchEvent(new KeyboardEvent('keydown', { key: firstKey }))
  window.dispatchEvent(new KeyboardEvent('keydown', { key: secondKey }))

  blurPressedKeys(firstKey, secondKey)
}

export default simulateShortcut
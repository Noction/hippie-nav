import { Modifier } from '@/types'
import { useEventListener } from '@vueuse/core'

export type KeyboardShortcut = string[]

export function isMatchingShortcut (shortcut: KeyboardShortcut) {
  for (const combination of shortcut) {
    if (isMatchingCombination(combination.toLowerCase())) {
      return true
    }
  }
  return false
}

const pressedKeys = new Set<string>()

export const modifiers: Modifier = {
  alt: { key: 'Alt', pressed: false },
  ctrl: { key: 'Control', pressed: false },
  meta: { key: 'Meta', pressed: false },
  shift: { key: 'Shift', pressed: false }
}

window.addEventListener('keydown', event => {
  for (const i in modifiers) {
    const mod = modifiers[i]

    if (mod.key === event.key) {
      mod.pressed = true
      return
    }
  }
  pressedKeys.add(event.key.toLocaleLowerCase())
})

window.addEventListener('keyup', event => {
  requestAnimationFrame(() => {
    pressedKeys.clear()
    for (const i in modifiers) {
      const mod = modifiers[i]

      if (mod.key === event.key) {
        mod.pressed = false
        break
      }
    }
  })
})

window.addEventListener('blur', () => {
  pressedKeys.clear()
  for (const i in modifiers) {
    const mod = modifiers[i]

    mod.pressed = false
  }
})

function isMatchingCombination (combination: string) {
  const splitted = combination.split('+').map(key => key.trim())
  const targetKey = splitted.pop()

  for (const mod in modifiers) {
    const containsMod = splitted.includes(mod)
    const isPressed = modifiers[mod].pressed

    if (containsMod !== isPressed) {
      return false
    }
  }
  return pressedKeys.has(targetKey)
}

export function useShortcut (handler: () => void, shortcut: string[]): () => void {
  return useEventListener('keydown', event => {
    if (isMatchingShortcut(shortcut)) {
      handler()
      event.preventDefault()
    }
  })

}
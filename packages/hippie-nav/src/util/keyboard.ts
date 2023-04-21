import { Modifier } from '@/types'
import { isMac } from './env'
import { useEventListener } from '@vueuse/core'
import { Ref, isRef } from 'vue'

export type KeyboardHandler = (event: KeyboardEvent) => unknown

export type KeyboardShortcut = string[]

export interface KeyboardShortcutOptions {
    event?: 'keyup' | 'keydown' | 'keypress'
}

export function formatKey (key: string) {
  key = key.toLowerCase()
  const keys = new Map()

  keys.set('ctrl', isMac ? '^' : 'Ctrl')
  keys.set('alt', isMac ? '⎇' : 'Alt' )
  keys.set('shift', '⇧')
  keys.set('meta', '⌘')
  keys.set('enter', '⏎' )
  if (keys.has(key)) {
    return keys.get(key)
  }

  return key.charAt(0).toUpperCase() + key.substring(1).toLowerCase()
}

const modifiers: Modifier = {
  alt: { key: 'Alt', pressed: false },
  ctrl: { key: 'Control', pressed: false },
  meta: { key: 'Meta', pressed: false },
  shift: { key: 'Shift', pressed: false }
}

const pressedKeys = new Set<string>()

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

function isMatchingShortcut (shortcut: KeyboardShortcut): boolean {
  for (const combination of shortcut) {
    if (isMatchingCombination(combination.toLowerCase())) {
      return true
    }
  }
  return false
}

function isMatchingCombination (combination: string): boolean {
  const splitted = combination.split('+').map(key => key.trim())
  const targetKey = splitted.pop()

  for (const mod in modifiers) {
    const containsMod = splitted.includes(mod)
    const isPressed = modifiers[mod].pressed

    if (containsMod !== isPressed) {
      return false
    }
  }
  return pressedKeys.has(targetKey as string)
}

export function onKeyboardShortcut (shortcut: KeyboardShortcut | Ref<KeyboardShortcut>, handler: KeyboardHandler, options: KeyboardShortcutOptions = {}) {
  useEventListener(options.event ?? 'keydown', event => {
    if (isMatchingShortcut(isRef(shortcut) ? shortcut.value : shortcut)) {
      handler(event)
    }
  })
}

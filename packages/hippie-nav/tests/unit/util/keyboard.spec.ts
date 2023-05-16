import {  useShortcut } from '@/util/keyboard'
import {  beforeEach, expect } from 'vitest'
function simulateShortcut (firstKey: string, secondKey: string) {
  window.dispatchEvent(new KeyboardEvent('keydown', { key: firstKey }))
  window.dispatchEvent(new KeyboardEvent('keydown', { key: secondKey }))

  blurPressedKeys(firstKey, secondKey)
}

function blurPressedKeys (firstKey: string, secondKey: string) {
  window.dispatchEvent(new KeyboardEvent('blur', { key: firstKey }))
  window.dispatchEvent(new KeyboardEvent('blur', { key: secondKey }))
}

let cleanUp: () => void

describe('keyboard', () => {
  beforeEach(() => {
    vi.restoreAllMocks()
    if (cleanUp) {
      cleanUp()
    }
  })

  it('should run handler once on pressed ctrl+K', () => {
    const mockFn = vi.fn()

    cleanUp = useShortcut(mockFn, ['ctrl+k'])
    simulateShortcut('Control', 'K')

    expect(mockFn).toHaveBeenCalledOnce()
  })
  it('should run handler twice on pressed ctrl+K', async () => {
    const mockFn = vi.fn()

    cleanUp = useShortcut(mockFn, ['ctrl+k'])
    simulateShortcut('Control', 'K')
    simulateShortcut('Control', 'K')

    expect(mockFn).toHaveBeenCalledTimes(2)
  })

  it('should not run handler on pressed ctrl+M', async () => {
    const mockFn = vi.fn(() => 1)

    cleanUp = useShortcut(mockFn, ['ctrl+k'])
    simulateShortcut('Control', 'M')

    expect(mockFn).not.toHaveBeenCalledOnce()
  })

  it('should run handler once on pressed meta+K', () => {
    const mockFn = vi.fn()

    cleanUp = useShortcut(mockFn, ['meta+k'])
    simulateShortcut('Meta', 'K')

    expect(mockFn).toHaveBeenCalledOnce()
  })
  it('should run handler twice on pressed meta+K', async () => {
    const mockFn = vi.fn()

    cleanUp = useShortcut(mockFn, ['meta+k'])
    simulateShortcut('Meta', 'K')
    simulateShortcut('Meta', 'K')

    expect(mockFn).toHaveBeenCalledTimes(2)
  })

  it('should not run handler on pressed meta+M', async () => {
    const mockFn = vi.fn(() => 1)

    cleanUp = useShortcut(mockFn, ['meta+k'])
    simulateShortcut('Meta', 'M')

    expect(mockFn).not.toHaveBeenCalledOnce()
  })
})

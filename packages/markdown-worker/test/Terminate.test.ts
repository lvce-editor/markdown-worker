import { expect, test, jest } from '@jest/globals'
import * as Terminate from '../src/parts/Terminate/Terminate.ts'

test('terminate calls globalThis.close', () => {
  const mockClose = jest.fn()
  const originalClose = globalThis.close
  globalThis.close = mockClose

  Terminate.terminate()

  expect(mockClose).toHaveBeenCalledTimes(1)
  globalThis.close = originalClose
})

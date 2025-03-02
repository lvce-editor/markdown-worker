import { expect, test, jest } from '@jest/globals'

const mockMain = {
  main: jest.fn(),
}

jest.unstable_mockModule('../src/parts/Main/Main.ts', () => mockMain)

test('markdownWorkerMain calls Main.main', async () => {
  await import('../src/markdownWorkerMain.ts')
  expect(mockMain.main).toHaveBeenCalled()
})

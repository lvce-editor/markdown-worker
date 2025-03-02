import { expect, test, jest } from '@jest/globals'

const mockListen = jest.fn()

jest.unstable_mockModule('../src/parts/Listen/Listen.ts', () => ({
  listen: mockListen,
}))

const Main = await import('../src/parts/Main/Main.ts')

test('main calls listen', async () => {
  await Main.main()
  expect(mockListen).toHaveBeenCalled()
})

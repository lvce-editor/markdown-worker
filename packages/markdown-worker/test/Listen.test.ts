import { expect, jest, test } from '@jest/globals'

const mockRpc = {
  id: 'test-rpc',
} as any
const mockCreate = jest.fn()

jest.unstable_mockModule('@lvce-editor/rpc', () => ({
  WebWorkerRpcClient: {
    create: mockCreate,
  },
}))

test('listen - creates rpc client and sets it in registry', async () => {
  // @ts-ignore
  mockCreate.mockResolvedValue(mockRpc)

  const { listen } = await import('../src/parts/Listen/Listen.ts')
  const RpcRegistry = await import('@lvce-editor/rpc-registry')
  const RpcId = await import('../src/parts/RpcId/RpcId.ts')

  await listen()

  expect(mockCreate).toHaveBeenCalledWith({
    commandMap: expect.any(Object),
  })
  expect(RpcRegistry.get(RpcId.RendererWorker)).toBe(mockRpc)
})

test('listen - handles error', async () => {
  const mockError = new Error('test error')
  // @ts-ignore
  mockCreate.mockRejectedValue(mockError)

  const { listen } = await import('../src/parts/Listen/Listen.ts')

  await expect(listen()).rejects.toThrow('test error')
})

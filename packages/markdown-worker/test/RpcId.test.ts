import { expect, test } from '@jest/globals'
import * as RpcId from '../src/parts/RpcId/RpcId.ts'

test('RendererWorker', () => {
  expect(RpcId.RendererWorker).toBe(1)
})

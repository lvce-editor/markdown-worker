import { test } from '@jest/globals'
import { mockWorkerGlobalRpc } from '@lvce-editor/rpc'

test('markdownWorkerMain calls Main.main', async () => {
  const { start, dispose } = mockWorkerGlobalRpc()
  const mainPromise = import('../src/markdownWorkerMain.ts')
  start()
  await mainPromise
  dispose()
})

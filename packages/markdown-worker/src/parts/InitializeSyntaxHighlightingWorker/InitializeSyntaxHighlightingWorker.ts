import { LazyTransferMessagePortRpcParent } from '@lvce-editor/rpc'
import { RendererWorker, SyntaxHighlightingWorker } from '@lvce-editor/rpc-registry'

export const initializeSyntaxHighlightingWorker = async (): Promise<void> => {
  const rpc = await LazyTransferMessagePortRpcParent.create({
    commandMap: {},
    send(port) {
      return RendererWorker.sendMessagePortToSyntaxHighlightingWorker(port)
    },
  })
  SyntaxHighlightingWorker.set(rpc)
}

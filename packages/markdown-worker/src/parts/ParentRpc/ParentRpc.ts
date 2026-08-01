import { RendererWorker } from '@lvce-editor/rpc-registry'

export const set = (...args: Readonly<Parameters<typeof RendererWorker.set>>): ReturnType<typeof RendererWorker.set> => RendererWorker.set(...args)

import { join } from 'node:path'
import { createRequire } from 'node:module'
import { pathToFileURL } from 'node:url'
import { root } from './root.js'
import { cp } from 'node:fs/promises'

const requireFromServerWorkspace = createRequire(join(root, 'packages', 'server', 'package.json'))
const serverPackagePath = requireFromServerWorkspace.resolve('@lvce-editor/server/package.json')
const requireFromServer = createRequire(serverPackagePath)
const sharedProcessPath = requireFromServer.resolve('@lvce-editor/shared-process')

const sharedProcessUrl = pathToFileURL(sharedProcessPath).toString()

const sharedProcess = await import(sharedProcessUrl)

process.env.PATH_PREFIX = '/markdown-worker'
await sharedProcess.exportStatic({
  root,
  extensionPath: '',
})

// await cp(
//   join(root, '.tmp', 'dist', 'dist', 'markdownWorkerMain.js'),
//   join(root, 'dist', commitHash, 'packages', 'markdown-worker', 'dist', 'markdownWorkerMain.js'),
// )

await cp(join(root, 'dist'), join(root, '.tmp', 'static'), { recursive: true })

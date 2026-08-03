import { execa } from 'execa'
import { createRequire } from 'node:module'
import { dirname, join } from 'node:path'
import { root } from './root.js'

const requireFromServerWorkspace = createRequire(join(root, 'packages', 'server', 'package.json'))
const serverPackagePath = requireFromServerWorkspace.resolve('@lvce-editor/server/package.json')
const serverPath = join(dirname(serverPackagePath), 'bin', 'server.js')

const main = async () => {
  execa(`npm`, ['run', 'build:watch'], {
    cwd: root,
    stdio: 'inherit',
  })
  execa(process.execPath, [serverPath, '--test-path=packages/e2e'], {
    cwd: root,
    stdio: 'inherit',
  })
}

main()

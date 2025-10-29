import { join } from 'node:path'
import { root } from './root.ts'

export const threshold = 570_000

export const instantiations = 2000

export const instantiationsPath = join(root, 'packages', 'markdown-worker')

export const workerPath = join(root, '.tmp/dist/dist/markdownWorkerMain.js')

export const playwrightPath = new URL('../../e2e/node_modules/playwright/index.mjs', import.meta.url).toString()

import * as InitializeSyntaxHighlightingWorker from '../InitializeSyntaxHighlightingWorker/InitializeSyntaxHighlightingWorker.ts'
import * as Listen from '../Listen/Listen.ts'

export const main = async (): Promise<void> => {
  await Listen.listen()
  await InitializeSyntaxHighlightingWorker.initializeSyntaxHighlightingWorker()
}

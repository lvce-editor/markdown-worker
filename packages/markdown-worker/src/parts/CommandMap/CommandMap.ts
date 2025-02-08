import * as GetMarkdownVirtualDom from '../GetMarkdownVirtualDom/GetMarkdownVirtualDom.ts'
import * as RenderMarkdown from '../RenderMarkdown/RenderMarkdown.ts'
import * as Terminate from '../Terminate/Terminate.ts'

export const commandMap = {
  'Markdown.getMarkDownVirtualDom': GetMarkdownVirtualDom.getMarkdownVirtualDom,
  'Markdown.renderMarkdown': RenderMarkdown.renderMarkdown,
  'Markdown.terminate': Terminate.terminate,
}

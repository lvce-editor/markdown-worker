import * as GetMarkdownVirtualDom from '../GetMarkdownVirtualDom/GetMarkdownVirtualDom.ts'
import * as RenderMarkdown from '../RenderMarkdown/RenderMarkdown.ts'
import * as Terminate from '../Terminate/Terminate.ts'

export const commandMap = {
  'Markdown.getVirtualDom': GetMarkdownVirtualDom.getMarkdownVirtualDom,
  'Markdown.render': RenderMarkdown.renderMarkdown,
  'Markdown.terminate': Terminate.terminate,

  // deprecated
  'Markdown.renderMarkdown': RenderMarkdown.renderMarkdown,
  'Markdown.getMarkDownVirtualDom': GetMarkdownVirtualDom.getMarkdownVirtualDom,
}

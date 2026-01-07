import { terminate } from '@lvce-editor/viewlet-registry'
import * as GetMarkdownVirtualDom from '../GetMarkdownVirtualDom/GetMarkdownVirtualDom.ts'
import * as HandleMessagePort from '../HandleMessagePort/HandleMessagePort.ts'
import * as RenderMarkdown from '../RenderMarkdown/RenderMarkdown.ts'

export const commandMap = {
  'Markdown.getMarkDownVirtualDom': GetMarkdownVirtualDom.getMarkdownVirtualDom,
  'Markdown.getVirtualDom': GetMarkdownVirtualDom.getMarkdownVirtualDom,
  'Markdown.handleMessagePort': HandleMessagePort.handleMessagePort,
  'Markdown.render': RenderMarkdown.renderMarkdown,

  // deprecated
  'Markdown.renderMarkdown': RenderMarkdown.renderMarkdown,
  'Markdown.terminate': terminate,
}

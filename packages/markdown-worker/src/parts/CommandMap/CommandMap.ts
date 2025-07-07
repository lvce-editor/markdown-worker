import { terminate } from '@lvce-editor/viewlet-registry'
import * as GetMarkdownVirtualDom from '../GetMarkdownVirtualDom/GetMarkdownVirtualDom.ts'
import * as RenderMarkdown from '../RenderMarkdown/RenderMarkdown.ts'

export const commandMap = {
  'Markdown.getVirtualDom': GetMarkdownVirtualDom.getMarkdownVirtualDom,
  'Markdown.render': RenderMarkdown.renderMarkdown,
  'Markdown.terminate': terminate,

  // deprecated
  'Markdown.renderMarkdown': RenderMarkdown.renderMarkdown,
  'Markdown.getMarkDownVirtualDom': GetMarkdownVirtualDom.getMarkdownVirtualDom,
}

import { VirtualDomElements } from '@lvce-editor/virtual-dom-worker'
import * as ElementTags from '../ElementTags/ElementTags.ts'

const tagMap: Record<string, number> = {
  [ElementTags.A]: VirtualDomElements.A,
  [ElementTags.Abbr]: VirtualDomElements.Abbr,
  [ElementTags.Article]: VirtualDomElements.Article,
  [ElementTags.Aside]: VirtualDomElements.Aside,
  [ElementTags.Br]: VirtualDomElements.Br,
  [ElementTags.Cite]: VirtualDomElements.Cite,
  [ElementTags.Data]: VirtualDomElements.Data,
  [ElementTags.Dd]: VirtualDomElements.Dd,
  [ElementTags.Div]: VirtualDomElements.Div,
  [ElementTags.Dl]: VirtualDomElements.Dl,
  [ElementTags.Figcaption]: VirtualDomElements.Figcaption,
  [ElementTags.Figure]: VirtualDomElements.Figure,
  [ElementTags.Footer]: VirtualDomElements.Footer,
  [ElementTags.H1]: VirtualDomElements.H1,
  [ElementTags.H2]: VirtualDomElements.H2,
  [ElementTags.H3]: VirtualDomElements.H3,
  [ElementTags.H4]: VirtualDomElements.H4,
  [ElementTags.H5]: VirtualDomElements.H5,
  [ElementTags.Header]: VirtualDomElements.Header,
  [ElementTags.Hr]: VirtualDomElements.Hr,
  [ElementTags.Img]: VirtualDomElements.Img,
  [ElementTags.Li]: VirtualDomElements.Li,
  [ElementTags.Nav]: VirtualDomElements.Nav,
  [ElementTags.Ol]: VirtualDomElements.Ol,
  [ElementTags.P]: VirtualDomElements.P,
  [ElementTags.Pre]: VirtualDomElements.Pre,
  [ElementTags.Search]: VirtualDomElements.Search,
  [ElementTags.Section]: VirtualDomElements.Section,
  [ElementTags.Span]: VirtualDomElements.Span,
  [ElementTags.Tfoot]: VirtualDomElements.Tfoot,
  [ElementTags.Time]: VirtualDomElements.Time,
}

export const getVirtualDomTag = (text: string): number => {
  return tagMap[text] ?? VirtualDomElements.Div
}

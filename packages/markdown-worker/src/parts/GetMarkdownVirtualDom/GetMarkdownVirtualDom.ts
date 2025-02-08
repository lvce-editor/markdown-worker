import type { VirtualDomNode } from '../VirtualDomNode/VirtualDomNode.ts'
import * as AllowedMarkdownAttributes from '../AllowedMarkdownAttributes/AllowedMarkdownAttributes.ts'
import * as AriaRoles from '../AriaRoles/AriaRoles.ts'
import * as Assert from '../Assert/Assert.ts'
import * as ClassNames from '../ClassNames/ClassNames.ts'
import * as DomEventListenerFunctions from '../DomEventListenerFunctions/DomEventListenerFunctions.ts'
import * as GetVirtualDomChildCount from '../GetVirtualDomChildCount/GetVirtualDomChildCount.ts'
import * as ParseHtml from '../ParseHtml/ParseHtml.ts'
import * as VirtualDomElements from '../VirtualDomElements/VirtualDomElements.ts'

export const getMarkdownVirtualDom = (html: string): readonly VirtualDomNode[] => {
  Assert.string(html)
  const childDom = ParseHtml.parseHtml(html, AllowedMarkdownAttributes.allowedMarkdownAttributes)
  const markdownChildCount = GetVirtualDomChildCount.getVirtualDomChildCount(childDom)
  return [
    {
      type: VirtualDomElements.Div,
      className: ClassNames.Markdown,
      role: AriaRoles.Document,
      onContextMenu: DomEventListenerFunctions.HandleReadmeContextMenu,
      childCount: markdownChildCount,
    },
    ...childDom,
  ]
}

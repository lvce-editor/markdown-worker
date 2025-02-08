import type { VirtualDomNode } from '../VirtualDomNode/VirtualDomNode.ts'
import * as Assert from '../Assert/Assert.ts'
import * as GetVirtualDomTag from '../GetVirtualDomTag/GetVirtualDomTag.ts'
import * as HtmlTokenType from '../HtmlTokenType/HtmlTokenType.ts'
import * as IsSelfClosingTag from '../IsSelfClosingTag/IsSelfClosingTag.ts'
import * as ParseText from '../ParseText/ParseText.ts'
import * as TokenizeHtml from '../TokenizeHtml/TokenizeHtml.ts'
import { text } from '../VirtualDomHelpers/VirtualDomHelpers.ts'

export const parseHtml = (html: string, allowedAttributes: readonly string[]): readonly VirtualDomNode[] => {
  Assert.string(html)
  Assert.array(allowedAttributes)
  const tokens = TokenizeHtml.tokenizeHtml(html)
  const dom = []
  const root = {
    type: 0,
    childCount: 0,
  }
  let current: any = root
  const stack = [root]
  let attributeName = ''
  for (const token of tokens) {
    switch (token.type) {
      case HtmlTokenType.TagNameStart:
        current.childCount++
        current = {
          type: GetVirtualDomTag.getVirtualDomTag(token.text),
          childCount: 0,
        }
        dom.push(current)
        if (!IsSelfClosingTag.isSelfClosingTag(token.text)) {
          stack.push(current)
        }
        break
      case HtmlTokenType.TagNameEnd:
        stack.pop()
        current = stack.at(-1) || root
        break
      case HtmlTokenType.Content:
        current.childCount++
        dom.push(text(ParseText.parseText(token.text)))
        break
      case HtmlTokenType.AttributeName:
        attributeName = token.text
        if (attributeName === 'class') {
          attributeName = 'className'
        }
        break
      case HtmlTokenType.AttributeValue:
        if (allowedAttributes.includes(attributeName)) {
          current[attributeName] = token.text
        }
        attributeName = ''
        break
      default:
        break
    }
  }
  return dom
}

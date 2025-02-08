import { expect, test } from '@jest/globals'
import * as ElementTags from '../src/parts/ElementTags/ElementTags.ts'
import * as GetVirtualDomTag from '../src/parts/GetVirtualDomTag/GetVirtualDomTag.ts'
import * as VirtualDomElements from '../src/parts/VirtualDomElements/VirtualDomElements.ts'

test('heading tags', () => {
  expect(GetVirtualDomTag.getVirtualDomTag(ElementTags.H1)).toBe(VirtualDomElements.H1)
  expect(GetVirtualDomTag.getVirtualDomTag(ElementTags.H2)).toBe(VirtualDomElements.H2)
  expect(GetVirtualDomTag.getVirtualDomTag(ElementTags.H3)).toBe(VirtualDomElements.H3)
  expect(GetVirtualDomTag.getVirtualDomTag(ElementTags.H4)).toBe(VirtualDomElements.H4)
  expect(GetVirtualDomTag.getVirtualDomTag(ElementTags.H5)).toBe(VirtualDomElements.H5)
})

test('structural tags', () => {
  expect(GetVirtualDomTag.getVirtualDomTag(ElementTags.Div)).toBe(VirtualDomElements.Div)
  expect(GetVirtualDomTag.getVirtualDomTag(ElementTags.Article)).toBe(VirtualDomElements.Article)
  expect(GetVirtualDomTag.getVirtualDomTag(ElementTags.Section)).toBe(VirtualDomElements.Section)
  expect(GetVirtualDomTag.getVirtualDomTag(ElementTags.Nav)).toBe(VirtualDomElements.Nav)
  expect(GetVirtualDomTag.getVirtualDomTag(ElementTags.Header)).toBe(VirtualDomElements.Header)
  expect(GetVirtualDomTag.getVirtualDomTag(ElementTags.Footer)).toBe(VirtualDomElements.Footer)
})

test('inline tags', () => {
  expect(GetVirtualDomTag.getVirtualDomTag(ElementTags.Span)).toBe(VirtualDomElements.Span)
  expect(GetVirtualDomTag.getVirtualDomTag(ElementTags.A)).toBe(VirtualDomElements.A)
  expect(GetVirtualDomTag.getVirtualDomTag(ElementTags.Img)).toBe(VirtualDomElements.Img)
  expect(GetVirtualDomTag.getVirtualDomTag(ElementTags.Br)).toBe(VirtualDomElements.Br)
  expect(GetVirtualDomTag.getVirtualDomTag(ElementTags.Abbr)).toBe(VirtualDomElements.Abbr)
})

test('list tags', () => {
  expect(GetVirtualDomTag.getVirtualDomTag(ElementTags.Ol)).toBe(VirtualDomElements.Ol)
  expect(GetVirtualDomTag.getVirtualDomTag(ElementTags.Li)).toBe(VirtualDomElements.Li)
  expect(GetVirtualDomTag.getVirtualDomTag(ElementTags.Dl)).toBe(VirtualDomElements.Dl)
  expect(GetVirtualDomTag.getVirtualDomTag(ElementTags.Dd)).toBe(VirtualDomElements.Dd)
})

test('text content tags', () => {
  expect(GetVirtualDomTag.getVirtualDomTag(ElementTags.P)).toBe(VirtualDomElements.P)
  expect(GetVirtualDomTag.getVirtualDomTag(ElementTags.Pre)).toBe(VirtualDomElements.Pre)
  expect(GetVirtualDomTag.getVirtualDomTag(ElementTags.Cite)).toBe(VirtualDomElements.Cite)
})

test('figure tags', () => {
  expect(GetVirtualDomTag.getVirtualDomTag(ElementTags.Figure)).toBe(VirtualDomElements.Figure)
  expect(GetVirtualDomTag.getVirtualDomTag(ElementTags.Figcaption)).toBe(VirtualDomElements.Figcaption)
})

test('data tags', () => {
  expect(GetVirtualDomTag.getVirtualDomTag(ElementTags.Time)).toBe(VirtualDomElements.Time)
  expect(GetVirtualDomTag.getVirtualDomTag(ElementTags.Data)).toBe(VirtualDomElements.Data)
})

test('semantic tags', () => {
  expect(GetVirtualDomTag.getVirtualDomTag(ElementTags.Aside)).toBe(VirtualDomElements.Aside)
})

test('search', () => {
  expect(GetVirtualDomTag.getVirtualDomTag(ElementTags.Search)).toBe(VirtualDomElements.Search)
})

test('hr', () => {
  expect(GetVirtualDomTag.getVirtualDomTag(ElementTags.Hr)).toBe(VirtualDomElements.Hr)
})

test('tfoot', () => {
  expect(GetVirtualDomTag.getVirtualDomTag(ElementTags.Tfoot)).toBe(VirtualDomElements.Tfoot)
})

test('unknown tag defaults to div', () => {
  expect(GetVirtualDomTag.getVirtualDomTag('unknown')).toBe(VirtualDomElements.Div)
  expect(GetVirtualDomTag.getVirtualDomTag('')).toBe(VirtualDomElements.Div)
  // @ts-expect-error
  expect(GetVirtualDomTag.getVirtualDomTag(undefined)).toBe(VirtualDomElements.Div)
  // @ts-expect-error
  expect(GetVirtualDomTag.getVirtualDomTag(null)).toBe(VirtualDomElements.Div)
})

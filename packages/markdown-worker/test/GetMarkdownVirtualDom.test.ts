import { expect, test } from '@jest/globals'
import { text, VirtualDomElements } from '@lvce-editor/virtual-dom-worker'
import * as GetMarkdownVirtualDom from '../src/parts/GetMarkdownVirtualDom/GetMarkdownVirtualDom.ts'

test('empty string', () => {
  expect(GetMarkdownVirtualDom.getMarkdownVirtualDom('')).toEqual([
    {
      childCount: 0,
      className: 'Markdown',
      onContextMenu: 'handleReadmeContextMenu',
      role: 'document',
      type: 4,
    },
  ])
})

test('plain text', () => {
  expect(GetMarkdownVirtualDom.getMarkdownVirtualDom('Hello World')).toEqual([
    {
      childCount: 1,
      className: 'Markdown',
      onContextMenu: 'handleReadmeContextMenu',
      role: 'document',
      type: 4,
    },
    text('Hello World'),
  ])
})

test('heading', () => {
  expect(GetMarkdownVirtualDom.getMarkdownVirtualDom('<h1>Hello World</h1>')).toEqual([
    {
      childCount: 1,
      className: 'Markdown',
      onContextMenu: 'handleReadmeContextMenu',
      role: 'document',
      type: 4,
    },
    {
      childCount: 1,
      type: VirtualDomElements.H1,
    },
    text('Hello World'),
  ])
})

test('nested elements', () => {
  expect(GetMarkdownVirtualDom.getMarkdownVirtualDom('<div><p>Hello World</p></div>')).toEqual([
    {
      childCount: 1,
      className: 'Markdown',
      onContextMenu: 'handleReadmeContextMenu',
      role: 'document',
      type: 4,
    },
    {
      childCount: 1,
      type: VirtualDomElements.Div,
    },
    {
      childCount: 1,
      type: VirtualDomElements.P,
    },
    text('Hello World'),
  ])
})

test('throws error for non-string input', () => {
  // @ts-expect-error
  expect(() => GetMarkdownVirtualDom.getMarkdownVirtualDom(123)).toThrow()
})

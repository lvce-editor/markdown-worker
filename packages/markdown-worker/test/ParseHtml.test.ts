import { expect, test } from '@jest/globals'
import { text, VirtualDomElements } from '@lvce-editor/virtual-dom-worker'
import * as ParseHtml from '../src/parts/ParseHtml/ParseHtml.ts'

test('text', () => {
  const html = 'Hello World'
  const allowedAttributes: readonly string[] = []
  expect(ParseHtml.parseHtml(html, allowedAttributes)).toEqual([text('Hello World')])
})

test('heading', () => {
  const html = '<h1>Hello World</h1>'
  const allowedAttributes: readonly string[] = []
  expect(ParseHtml.parseHtml(html, allowedAttributes)).toEqual([
    {
      childCount: 1,
      type: VirtualDomElements.H1,
    },
    text('Hello World'),
  ])
})

test('element with id', () => {
  const html = '<h1 id="hello-world"></h1>'
  const allowedAttributes = ['id']
  expect(ParseHtml.parseHtml(html, allowedAttributes)).toEqual([
    {
      childCount: 0,
      id: 'hello-world',
      type: VirtualDomElements.H1,
    },
  ])
})

test('element with with image', () => {
  const html = '<p><img alt="demo" src="./demo.png"></p>'
  const allowedAttributes = ['alt', 'src']
  expect(ParseHtml.parseHtml(html, allowedAttributes)).toEqual([
    {
      childCount: 1,
      type: VirtualDomElements.P,
    },
    {
      alt: 'demo',
      childCount: 0,
      src: './demo.png',
      type: VirtualDomElements.Img,
    },
  ])
})

test('element with with image and sibling tag', () => {
  const html = '<p><img alt="demo" src="./demo.png"></p><p>more text</p>'
  const allowedAttributes = ['alt', 'src']
  expect(ParseHtml.parseHtml(html, allowedAttributes)).toEqual([
    {
      childCount: 1,
      type: VirtualDomElements.P,
    },
    {
      alt: 'demo',
      childCount: 0,
      src: './demo.png',
      type: VirtualDomElements.Img,
    },
    {
      childCount: 1,
      type: VirtualDomElements.P,
    },
    text('more text'),
  ])
})

test('element with two child elements', () => {
  const html = '<div><div></div><div></div></div>'
  const allowedAttributes: readonly string[] = []
  expect(ParseHtml.parseHtml(html, allowedAttributes)).toEqual([
    {
      childCount: 2,
      type: VirtualDomElements.Div,
    },
    {
      childCount: 0,
      type: VirtualDomElements.Div,
    },
    {
      childCount: 0,
      type: VirtualDomElements.Div,
    },
  ])
})

test('deeply nested tags', () => {
  const html = '<div><div><div></div></div><div></div></div>'
  const allowedAttributes: readonly string[] = []
  expect(ParseHtml.parseHtml(html, allowedAttributes)).toEqual([
    {
      childCount: 2,
      type: VirtualDomElements.Div,
    },
    {
      childCount: 1,
      type: VirtualDomElements.Div,
    },
    {
      childCount: 0,
      type: VirtualDomElements.Div,
    },
    {
      childCount: 0,
      type: VirtualDomElements.Div,
    },
  ])
})

test('element with disallowed attribute', () => {
  const html = '<h1 onerror="alert(1)"></h1>'
  const allowedAttributes: readonly string[] = []
  expect(ParseHtml.parseHtml(html, allowedAttributes)).toEqual([
    {
      childCount: 0,
      type: VirtualDomElements.H1,
    },
  ])
})

test('nested element with id', () => {
  const html = '<p>some text<a href="#">link</a></p>'
  const allowedAttributes = ['href']
  expect(ParseHtml.parseHtml(html, allowedAttributes)).toEqual([
    {
      childCount: 2,
      type: VirtualDomElements.P,
    },
    text('some text'),
    {
      childCount: 1,
      href: '#',
      type: VirtualDomElements.A,
    },
    text('link'),
  ])
})

test('strong text followed by a link remains inline', () => {
  const html = '<p><strong>Full Changelog</strong>: <a href="https://example.com/compare/v1...v2">https://example.com/compare/v1...v2</a></p>'
  const allowedAttributes = ['href']
  expect(ParseHtml.parseHtml(html, allowedAttributes)).toEqual([
    {
      childCount: 3,
      type: VirtualDomElements.P,
    },
    {
      childCount: 1,
      type: VirtualDomElements.Strong,
    },
    text('Full Changelog'),
    text(': '),
    {
      childCount: 1,
      href: 'https://example.com/compare/v1...v2',
      type: VirtualDomElements.A,
    },
    text('https://example.com/compare/v1...v2'),
  ])
})

test('element with class', () => {
  const html = '<div class="EditorRow"></div>'
  const allowedAttributes = ['className']
  expect(ParseHtml.parseHtml(html, allowedAttributes)).toEqual([
    {
      childCount: 0,
      className: 'EditorRow',
      type: VirtualDomElements.Div,
    },
  ])
})

test('text with angle bracket', () => {
  const html = '<div>&gt;</div>'
  const allowedAttributes: readonly string[] = []
  expect(ParseHtml.parseHtml(html, allowedAttributes)).toEqual([
    {
      childCount: 1,
      type: VirtualDomElements.Div,
    },
    text('>'),
  ])
})

test('text with quotes', () => {
  const html = '<h2>&quot;What&#39;s Changed&quot;</h2>'
  const allowedAttributes: readonly string[] = []
  expect(ParseHtml.parseHtml(html, allowedAttributes)).toEqual([
    {
      childCount: 1,
      type: VirtualDomElements.H2,
    },
    text('"What\'s Changed"'),
  ])
})

test('closing tag updates current element correctly', () => {
  const html = '<div><p>text</p><span>more</span></div>'
  const allowedAttributes: readonly string[] = []
  expect(ParseHtml.parseHtml(html, allowedAttributes)).toEqual([
    {
      childCount: 2,
      type: VirtualDomElements.Div,
    },
    {
      childCount: 1,
      type: VirtualDomElements.P,
    },
    {
      childCount: 0,
      text: 'text',
      type: 12,
    },
    {
      childCount: 1,
      type: VirtualDomElements.Span,
    },
    {
      childCount: 0,
      text: 'more',
      type: 12,
    },
  ])
})

test('duplicate closing tag', () => {
  const html = '<div><p>text</p></p></p></div>'
  const allowedAttributes: readonly string[] = []
  expect(ParseHtml.parseHtml(html, allowedAttributes)).toEqual([
    {
      childCount: 1,
      type: VirtualDomElements.Div,
    },
    {
      childCount: 1,
      type: VirtualDomElements.P,
    },
    {
      childCount: 0,
      text: 'text',
      type: 12,
    },
  ])
})

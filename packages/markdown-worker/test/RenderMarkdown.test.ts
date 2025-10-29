import { expect, test } from '@jest/globals'
import * as RenderMarkdown from '../src/parts/RenderMarkdown/RenderMarkdown.ts'

test('empty string', async () => {
  expect(await RenderMarkdown.renderMarkdown('')).toBe('')
})

test('plain text', async () => {
  expect(await RenderMarkdown.renderMarkdown('hello')).toBe('<p>hello</p>\n')
})

test('heading', async () => {
  expect(await RenderMarkdown.renderMarkdown('# hello')).toBe('<h1>hello</h1>\n')
})

test('link', async () => {
  expect(await RenderMarkdown.renderMarkdown('[test](https://example.com)')).toBe('<p><a href="https://example.com">test</a></p>\n')
})

test('link - external', async () => {
  // @ts-ignore
  globalThis.location = {
    protocol: 'http:',
    hostname: 'localhost',
  }
  expect(
    await RenderMarkdown.renderMarkdown('[test](https://example.com)', {
      linksExternal: true,
    }),
  ).toBe('<p><a target="_blank" rel="noreferrer noopener nofollow" href="https://example.com">test</a></p>\n')
})

test('code block', async () => {
  expect(await RenderMarkdown.renderMarkdown('```\ncode\n```')).toBe('<pre><code>code\n</code></pre>\n')
})

test('list', async () => {
  expect(await RenderMarkdown.renderMarkdown('- item 1\n- item 2')).toBe('<ul>\n<li>item 1</li>\n<li>item 2</li>\n</ul>\n')
})

test('blockquote', async () => {
  expect(await RenderMarkdown.renderMarkdown('> quote')).toBe('<blockquote>\n<p>quote</p>\n</blockquote>\n')
})

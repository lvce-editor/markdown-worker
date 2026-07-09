import { expect, test } from '@jest/globals'
import { PlainMessagePortRpc } from '@lvce-editor/rpc'
import { RendererWorker, SyntaxHighlightingWorker } from '@lvce-editor/rpc-registry'
import { initializeSyntaxHighlightingWorker } from '../src/parts/InitializeSyntaxHighlightingWorker/InitializeSyntaxHighlightingWorker.ts'
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

test('image - with base url', async () => {
  expect(
    await RenderMarkdown.renderMarkdown('![test](./image.png)', {
      baseUrl: 'https://example.com',
    }),
  ).toBe('<p><img src="https://example.com/image.png" alt="test"></p>\n')
})

test('image - invalid - with base url', async () => {
  expect(
    await RenderMarkdown.renderMarkdown('![test](...)', {
      baseUrl: 'https://example.com',
    }),
  ).toBe('<p><img src="https://example.com/..." alt="test"></p>\n')
})

test('image - invalid 2 - with base url', async () => {
  expect(
    await RenderMarkdown.renderMarkdown('![test](https://example.com)', {
      baseUrl: 'https://example.com',
    }),
  ).toBe('<p><img src="https://example.com" alt="test"></p>\n')
})

test('image - with invalid base url', async () => {
  expect(
    await RenderMarkdown.renderMarkdown('![test](./image.png)', {
      baseUrl: '/remote/builtin.theme-cobalt2',
    }),
  ).toBe('<p><img src="/remote/builtin.theme-cobalt2/image.png" alt="test"></p>\n')
})

test('link - external', async () => {
  // @ts-ignore
  globalThis.location = {
    hostname: 'localhost',
    protocol: 'http:',
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

test('code block - unknown language', async () => {
  expect(await RenderMarkdown.renderMarkdown('```unknown\ncode\n```')).toBe('<pre><code class="language-unknown">code\n</code></pre>\n')
})

test('code block - syntax highlighted using contributed extension alias', async () => {
  using mockRendererRpc = RendererWorker.registerMockRpc({
    async 'SendMessagePortToSyntaxHighlightingWorker.sendMessagePortToSyntaxHighlightingWorker'(port: MessagePort): Promise<void> {
      await PlainMessagePortRpc.create({
        commandMap: {
          'Tokenizer.tokenizeCodeBlock': () => [['git', 'Token Command', ' status', 'Token Text']],
        },
        messagePort: port,
      })
    },
  })
  await initializeSyntaxHighlightingWorker()

  expect(
    await RenderMarkdown.renderMarkdown('```sh\ngit status\n```', {
      languages: [
        {
          extensions: ['.sh'],
          id: 'shellscript',
          tokenize: '/extensions/shellscript/tokenize.js',
        },
      ],
    }),
  ).toBe('<pre><code class="language-sh"><span class="Token Command">git</span><span class="Token Text"> status</span>\n</code></pre>\n')
  expect(mockRendererRpc.invocations).toEqual([
    [
      'SendMessagePortToSyntaxHighlightingWorker.sendMessagePortToSyntaxHighlightingWorker',
      expect.anything(),
      'HandleMessagePort.handleMessagePort2',
    ],
  ])
  await SyntaxHighlightingWorker.dispose()
})

test('code block - keeps normal escaped output when syntax highlighting fails', async () => {
  using mockRendererRpc = RendererWorker.registerMockRpc({
    async 'SendMessagePortToSyntaxHighlightingWorker.sendMessagePortToSyntaxHighlightingWorker'(port: MessagePort): Promise<void> {
      await PlainMessagePortRpc.create({
        commandMap: {
          'Tokenizer.tokenizeCodeBlock': () => {
            throw new Error('tokenizer failed')
          },
        },
        messagePort: port,
      })
    },
  })
  await initializeSyntaxHighlightingWorker()

  expect(
    await RenderMarkdown.renderMarkdown('```javascript\nconst value = "<unsafe>"\n```', {
      languages: [{ id: 'javascript', tokenize: '/extensions/javascript/tokenize.js' }],
    }),
  ).toBe('<pre><code class="language-javascript">const value = &quot;&lt;unsafe&gt;&quot;\n</code></pre>\n')
  expect(mockRendererRpc.invocations).toHaveLength(1)
  await SyntaxHighlightingWorker.dispose()
})

test('code block - keeps normal output for invalid tokenizer response', async () => {
  using mockRendererRpc = RendererWorker.registerMockRpc({
    async 'SendMessagePortToSyntaxHighlightingWorker.sendMessagePortToSyntaxHighlightingWorker'(port: MessagePort): Promise<void> {
      await PlainMessagePortRpc.create({
        commandMap: {
          'Tokenizer.tokenizeCodeBlock': () => ({}),
        },
        messagePort: port,
      })
    },
  })
  await initializeSyntaxHighlightingWorker()

  expect(
    await RenderMarkdown.renderMarkdown('```javascript\nconst value = 1\n```', {
      languages: [{ id: 'javascript', tokenize: '/extensions/javascript/tokenize.js' }],
    }),
  ).toBe('<pre><code class="language-javascript">const value = 1\n</code></pre>\n')
  expect(mockRendererRpc.invocations).toHaveLength(1)
  await SyntaxHighlightingWorker.dispose()
})

test('list', async () => {
  expect(await RenderMarkdown.renderMarkdown('- item 1\n- item 2')).toBe('<ul>\n<li>item 1</li>\n<li>item 2</li>\n</ul>\n')
})

test('blockquote', async () => {
  expect(await RenderMarkdown.renderMarkdown('> quote')).toBe('<blockquote>\n<p>quote</p>\n</blockquote>\n')
})

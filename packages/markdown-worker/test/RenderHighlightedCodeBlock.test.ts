import { expect, test } from '@jest/globals'
import { renderHighlightedCodeBlock } from '../src/parts/RenderHighlightedCodeBlock/RenderHighlightedCodeBlock.ts'

test('renders tokenized lines', () => {
  expect(
    renderHighlightedCodeBlock('javascript', [
      ['const', 'Token Keyword', ' answer = ', 'Token Text', '42', 'Token Number'],
      ['console.log(answer)', 'Token Text'],
    ]),
  ).toBe(
    '<pre><code class="language-javascript"><span class="Token Keyword">const</span><span class="Token Text"> answer = </span><span class="Token Number">42</span>\n<span class="Token Text">console.log(answer)</span>\n</code></pre>\n',
  )
})

test('escapes token text, class names, and language ids', () => {
  expect(renderHighlightedCodeBlock('js" onclick="alert(1)', [['<&', 'Token "String"'], ['text'], ['', 'Token Text']])).toBe(
    '<pre><code class="language-js&quot; onclick=&quot;alert(1)"><span class="Token &quot;String&quot;">&lt;&amp;</span>\n<span class="Token Unknown">text</span>\n<span class="Token Text"></span>\n</code></pre>\n',
  )
})

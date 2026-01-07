import { expect, test } from '@jest/globals'
import * as TokenType from '../src/parts/HtmlTokenType/HtmlTokenType.ts'
import * as TokenizeHtml from '../src/parts/TokenizeHtml/TokenizeHtml.ts'
import { UnexpectedTokenError } from '../src/parts/UnexpectedTokenError/UnexpectedTokenError.ts'

test('plain text', () => {
  expect(TokenizeHtml.tokenizeHtml('Hello World')).toEqual([
    {
      text: 'Hello World',
      type: TokenType.Content,
    },
  ])
})

test('simple tag', () => {
  expect(TokenizeHtml.tokenizeHtml('<div>')).toEqual([
    {
      text: '<',
      type: TokenType.OpeningAngleBracket,
    },
    {
      text: 'div',
      type: TokenType.TagNameStart,
    },
    {
      text: '>',
      type: TokenType.ClosingAngleBracket,
    },
  ])
})

test('closing tag', () => {
  expect(TokenizeHtml.tokenizeHtml('</div>')).toEqual([
    {
      text: '<',
      type: TokenType.OpeningAngleBracket,
    },
    {
      text: '/',
      type: TokenType.ClosingTagSlash,
    },
    {
      text: 'div',
      type: TokenType.TagNameEnd,
    },
    {
      text: '>',
      type: TokenType.ClosingAngleBracket,
    },
  ])
})

test('tag with attribute', () => {
  expect(TokenizeHtml.tokenizeHtml('<div class="test">')).toEqual([
    {
      text: '<',
      type: TokenType.OpeningAngleBracket,
    },
    {
      text: 'div',
      type: TokenType.TagNameStart,
    },
    {
      text: ' ',
      type: TokenType.WhitespaceInsideOpeningTag,
    },
    {
      text: 'class',
      type: TokenType.AttributeName,
    },
    {
      text: '=',
      type: TokenType.AttributeEqualSign,
    },
    {
      text: '"',
      type: TokenType.AttributeQuoteStart,
    },
    {
      text: 'test',
      type: TokenType.AttributeValue,
    },
    {
      text: '"',
      type: TokenType.AttributeQuoteEnd,
    },
    {
      text: '>',
      type: TokenType.ClosingAngleBracket,
    },
  ])
})

test('comment', () => {
  expect(TokenizeHtml.tokenizeHtml('<!-- test -->')).toEqual([
    {
      text: '<!--',
      type: TokenType.CommentStart,
    },
    {
      text: ' test ',
      type: TokenType.Comment,
    },
    {
      text: '-->',
      type: TokenType.EndCommentTag,
    },
  ])
})

test.skip('self closing tag', () => {
  expect(TokenizeHtml.tokenizeHtml('<img/>')).toEqual([
    {
      text: '<',
      type: TokenType.OpeningAngleBracket,
    },
    {
      text: 'img',
      type: TokenType.TagNameStart,
    },
    {
      text: '/>',
      type: TokenType.ClosingAngleBracket,
    },
  ])
})

test.skip('throws on invalid token', () => {
  expect(() => TokenizeHtml.tokenizeHtml('<@>')).toThrow(UnexpectedTokenError)
})

test('tag with multiple attributes', () => {
  expect(TokenizeHtml.tokenizeHtml('<img src="test.png" alt="test">')).toEqual([
    {
      text: '<',
      type: TokenType.OpeningAngleBracket,
    },
    {
      text: 'img',
      type: TokenType.TagNameStart,
    },
    {
      text: ' ',
      type: TokenType.WhitespaceInsideOpeningTag,
    },
    {
      text: 'src',
      type: TokenType.AttributeName,
    },
    {
      text: '=',
      type: TokenType.AttributeEqualSign,
    },
    {
      text: '"',
      type: TokenType.AttributeQuoteStart,
    },
    {
      text: 'test.png',
      type: TokenType.AttributeValue,
    },
    {
      text: '"',
      type: TokenType.AttributeQuoteEnd,
    },
    {
      text: ' ',
      type: TokenType.WhitespaceInsideOpeningTag,
    },
    {
      text: 'alt',
      type: TokenType.AttributeName,
    },
    {
      text: '=',
      type: TokenType.AttributeEqualSign,
    },
    {
      text: '"',
      type: TokenType.AttributeQuoteStart,
    },
    {
      text: 'test',
      type: TokenType.AttributeValue,
    },
    {
      text: '"',
      type: TokenType.AttributeQuoteEnd,
    },
    {
      text: '>',
      type: TokenType.ClosingAngleBracket,
    },
  ])
})

test.skip('tag with single quotes', () => {
  expect(TokenizeHtml.tokenizeHtml("<div class='test'>")).toEqual([
    {
      text: '<',
      type: TokenType.OpeningAngleBracket,
    },
    {
      text: 'div',
      type: TokenType.TagNameStart,
    },
    {
      text: ' ',
      type: TokenType.WhitespaceInsideOpeningTag,
    },
    {
      text: 'class',
      type: TokenType.AttributeName,
    },
    {
      text: '=',
      type: TokenType.AttributeEqualSign,
    },
    {
      text: "'",
      type: TokenType.AttributeQuoteStart,
    },
    {
      text: 'test',
      type: TokenType.AttributeValue,
    },
    {
      text: "'",
      type: TokenType.AttributeQuoteEnd,
    },
    {
      text: '>',
      type: TokenType.ClosingAngleBracket,
    },
  ])
})

test('tag with unquoted attribute', () => {
  expect(TokenizeHtml.tokenizeHtml('<div class=test>')).toEqual([
    {
      text: '<',
      type: TokenType.OpeningAngleBracket,
    },
    {
      text: 'div',
      type: TokenType.TagNameStart,
    },
    {
      text: ' ',
      type: TokenType.WhitespaceInsideOpeningTag,
    },
    {
      text: 'class',
      type: TokenType.AttributeName,
    },
    {
      text: '=',
      type: TokenType.AttributeEqualSign,
    },
    {
      text: 'test',
      type: TokenType.AttributeValue,
    },
    {
      text: '>',
      type: TokenType.ClosingAngleBracket,
    },
  ])
})

test('tag with boolean attribute', () => {
  expect(TokenizeHtml.tokenizeHtml('<input disabled>')).toEqual([
    {
      text: '<',
      type: TokenType.OpeningAngleBracket,
    },
    {
      text: 'input',
      type: TokenType.TagNameStart,
    },
    {
      text: ' ',
      type: TokenType.WhitespaceInsideOpeningTag,
    },
    {
      text: 'disabled',
      type: TokenType.AttributeName,
    },
    {
      text: '>',
      type: TokenType.ClosingAngleBracket,
    },
  ])
})

test('unexpected character after closing tag slash', () => {
  expect(() => TokenizeHtml.tokenizeHtml('<div></=')).toThrow(new UnexpectedTokenError())
})

test('unexpected character after closing tag name', () => {
  expect(() => TokenizeHtml.tokenizeHtml('<div></a=')).toThrow(new UnexpectedTokenError())
})

test('whitespace after closing tag name', () => {
  expect(TokenizeHtml.tokenizeHtml('<div></a ')).toEqual(expect.anything())
})

test('doctype', () => {
  expect(TokenizeHtml.tokenizeHtml('<!DOCTYPE html>')).toEqual(expect.anything())
})

test('invalid closing tag - angle bracket after slash', () => {
  expect(TokenizeHtml.tokenizeHtml('<div></>')).toEqual(expect.anything())
})

test('invalid closing tag - whitespace after slash', () => {
  expect(TokenizeHtml.tokenizeHtml('<div></ ')).toEqual(expect.anything())
})

test('self closing tag with attribute', () => {
  expect(TokenizeHtml.tokenizeHtml('<img src=""/>')).toEqual(expect.anything())
})

test('opening angle bracket when attribute is expected', () => {
  expect(() => TokenizeHtml.tokenizeHtml('<img src=<')).toThrow(new UnexpectedTokenError())
})

test('attribute value newline', () => {
  expect(() => TokenizeHtml.tokenizeHtml('<img src="\n"/>')).toThrow(new UnexpectedTokenError())
})

test('unexpected angle bracket', () => {
  expect(TokenizeHtml.tokenizeHtml('< >')).toEqual(expect.anything())
})

test('unexpected self closing tag', () => {
  expect(TokenizeHtml.tokenizeHtml('< />')).toEqual(expect.anything())
})

test('unexpected attribute', () => {
  expect(TokenizeHtml.tokenizeHtml('< abc')).toEqual(expect.anything())
})

test('unexpected opening angle bracket', () => {
  expect(TokenizeHtml.tokenizeHtml('< <')).toEqual(expect.anything())
})

test('emoji content', () => {
  expect(TokenizeHtml.tokenizeHtml('😀')).toEqual(expect.anything())
})

test('closing tag at start', () => {
  expect(TokenizeHtml.tokenizeHtml('</div')).toEqual(expect.anything())
})

test('slash at start', () => {
  expect(TokenizeHtml.tokenizeHtml('/')).toEqual(expect.anything())
})

test('content after angle bracket', () => {
  expect(TokenizeHtml.tokenizeHtml('<.')).toEqual(expect.anything())
})

test('content after angle bracket 2', () => {
  expect(TokenizeHtml.tokenizeHtml('<?')).toEqual(expect.anything())
})

test('empty tag', () => {
  expect(TokenizeHtml.tokenizeHtml('<>')).toEqual(expect.anything())
})

test('emoji tag', () => {
  expect(TokenizeHtml.tokenizeHtml('<😀')).toEqual(expect.anything())
})

test('emoji closing tag', () => {
  expect(() => TokenizeHtml.tokenizeHtml('</😀')).toThrow(new UnexpectedTokenError())
})

test('invalid doctype', () => {
  expect(TokenizeHtml.tokenizeHtml('<!abc')).toEqual(expect.anything())
})

test('input', () => {
  const html = `<h1>test readme</h1>
<input onfocus=javascript:alert(1) autofocus>
`
  expect(TokenizeHtml.tokenizeHtml(html)).toEqual([
    { text: '<', type: 1 },
    { text: 'h1', type: 3 },
    { text: '>', type: 2 },
    { text: 'test readme', type: 5 },
    { text: '<', type: 1 },
    { text: '/', type: 6 },
    { text: 'h1', type: 4 },
    { text: '>', type: 2 },
    { text: '\n', type: 5 },
    { text: '<', type: 1 },
    {
      text: 'input',
      type: 3,
    },
    {
      text: ' ',
      type: 7,
    },
    {
      text: 'onfocus',
      type: 8,
    },
    {
      text: '=',
      type: 9,
    },
    {
      text: 'javascript:alert(1)',
      type: 11,
    },
    {
      text: ' ',
      type: 7,
    },
    {
      text: 'autofocus',
      type: 8,
    },
    {
      text: '>',
      type: 2,
    },
    {
      text: '\n',
      type: 5,
    },
  ])
})

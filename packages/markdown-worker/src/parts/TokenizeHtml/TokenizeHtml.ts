import type { HtmlToken } from '../HtmlToken/HtmlToken.ts'
import * as Assert from '../Assert/Assert.ts'
import * as TokenType from '../HtmlTokenType/HtmlTokenType.ts'
import { UnexpectedTokenError } from '../UnexpectedTokenError/UnexpectedTokenError.ts'

const State = {
  AfterAttributeEqualSign: 8,
  AfterAttributeName: 7,
  AfterAttributeValueClosingQuote: 11,
  AfterAttributeValueInsideDoubleQuote: 10,
  AfterClosingTagName: 5,
  AfterClosingTagSlash: 4,
  AfterExclamationMark: 16,
  AfterOpeningAngleBracket: 2,
  InsideAttributeAfterDoubleQuote: 9,
  InsideComment: 17,
  InsideOpeningTag: 3,
  InsideOpeningTagAfterWhitespace: 6,
  TopLevelContent: 1,
}

const RE_ANGLE_BRACKET_OPEN = /^</
const RE_ANGLE_BRACKET_OPEN_TAG = /^<(?![\s!%])/
const RE_ANGLE_BRACKET_CLOSE = /^>/
const RE_SLASH = /^\//
const RE_TAGNAME = /^[A-Za-z0-9$]+/
const RE_CONTENT = /^[^<>]+/
const RE_WHITESPACE = /^\s+/
const RE_ATTRIBUTE_NAME = /^[A-Za-z0-9-]+/
const RE_EQUAL_SIGN = /^=/
const RE_DOUBLE_QUOTE = /^"/
const RE_ATTRIBUTE_VALUE_INSIDE_DOUBLE_QUOTE = /^[^"\n]+/
const RE_TEXT = /^[^<>]+/
const RE_EXCLAMATION_MARK = /^!/
const RE_DASH_DASH = /^--/
const RE_DOCTYPE = /^doctype/i
const RE_BLOCK_COMMENT_CONTENT = /^[a-zA-Z\s]+/
const RE_COMMENT_END = /^-->/
const RE_TAG_TEXT = /^[^\s>]+/
const RE_ANY_TEXT = /^[^\n]+/
const RE_ATTRIBUTE_TEXT = /^[^<>/\s]+/
const RE_BLOCK_COMMENT_START = /^<!--/
const RE_SELF_CLOSING = /^\/>/

type Transition = {
  readonly regex: RegExp
  readonly type: number
  readonly nextState: number
}

type TokenizerResult = {
  readonly nextState: number
  readonly tokenText: string
  readonly type: number
}

type StateHandler = (part: string) => TokenizerResult

const transition = (regex: RegExp, type: number, nextState: number): Transition => {
  return {
    nextState,
    regex,
    type,
  }
}

const tokenizerResult = (tokenText: string, type: number, nextState: number): TokenizerResult => {
  return {
    nextState,
    tokenText,
    type,
  }
}

const matchTransition = (part: string, transitions: readonly Transition[]): TokenizerResult => {
  for (const transition of transitions) {
    const match = part.match(transition.regex)
    if (match) {
      return tokenizerResult(match[0], transition.type, transition.nextState)
    }
  }
  throw new UnexpectedTokenError()
}

const afterAttributeEqualSignTransitions: readonly Transition[] = [
  transition(RE_DOUBLE_QUOTE, TokenType.AttributeQuoteStart, State.InsideAttributeAfterDoubleQuote),
  transition(RE_ANGLE_BRACKET_CLOSE, TokenType.ClosingAngleBracket, State.TopLevelContent),
  transition(RE_ATTRIBUTE_TEXT, TokenType.AttributeValue, State.InsideOpeningTag),
]

const afterAttributeNameTransitions: readonly Transition[] = [
  transition(RE_EQUAL_SIGN, TokenType.AttributeEqualSign, State.AfterAttributeEqualSign),
  transition(RE_ANGLE_BRACKET_CLOSE, TokenType.ClosingAngleBracket, State.TopLevelContent),
  transition(RE_WHITESPACE, TokenType.WhitespaceInsideOpeningTag, State.InsideOpeningTagAfterWhitespace),
  transition(RE_ANGLE_BRACKET_OPEN, TokenType.OpeningAngleBracket, State.AfterOpeningAngleBracket),
]

const afterAttributeValueClosingQuoteTransitions: readonly Transition[] = [
  transition(RE_ANGLE_BRACKET_CLOSE, TokenType.ClosingAngleBracket, State.TopLevelContent),
  transition(RE_WHITESPACE, TokenType.WhitespaceInsideOpeningTag, State.InsideOpeningTagAfterWhitespace),
  transition(RE_SELF_CLOSING, TokenType.ClosingAngleBracket, State.TopLevelContent),
]

const afterAttributeValueInsideDoubleQuoteTransitions: readonly Transition[] = [
  transition(RE_DOUBLE_QUOTE, TokenType.AttributeQuoteEnd, State.AfterAttributeValueClosingQuote),
]

const afterClosingTagNameTransitions: readonly Transition[] = [
  transition(RE_ANGLE_BRACKET_CLOSE, TokenType.ClosingAngleBracket, State.TopLevelContent),
  transition(RE_WHITESPACE, TokenType.Content, State.TopLevelContent),
]

const afterClosingTagSlashTransitions: readonly Transition[] = [
  transition(RE_TAGNAME, TokenType.TagNameEnd, State.AfterClosingTagName),
  transition(RE_WHITESPACE, TokenType.WhitespaceAfterClosingTagSlash, State.TopLevelContent),
  transition(RE_ANGLE_BRACKET_CLOSE, TokenType.ClosingAngleBracket, State.TopLevelContent),
]

const afterExclamationMarkTransitions: readonly Transition[] = [
  transition(RE_DASH_DASH, TokenType.StartCommentDashes, State.InsideComment),
  transition(RE_DOCTYPE, TokenType.Doctype, State.InsideOpeningTag),
]

const afterOpeningAngleBracketTransitions: readonly Transition[] = [
  transition(RE_TAGNAME, TokenType.TagNameStart, State.InsideOpeningTag),
  transition(RE_SLASH, TokenType.ClosingTagSlash, State.AfterClosingTagSlash),
  transition(RE_WHITESPACE, TokenType.WhitespaceAfterOpeningTagOpenAngleBracket, State.TopLevelContent),
  transition(RE_ANGLE_BRACKET_CLOSE, TokenType.ClosingAngleBracket, State.TopLevelContent),
  transition(RE_EXCLAMATION_MARK, TokenType.ExclamationMark, State.AfterExclamationMark),
  transition(RE_ANY_TEXT, TokenType.Text, State.TopLevelContent),
]

const insideCommentTransitions: readonly Transition[] = [
  transition(RE_BLOCK_COMMENT_CONTENT, TokenType.Comment, State.InsideComment),
  transition(RE_COMMENT_END, TokenType.EndCommentTag, State.TopLevelContent),
]

const insideOpeningTagTransitions: readonly Transition[] = [
  transition(RE_ANGLE_BRACKET_CLOSE, TokenType.ClosingAngleBracket, State.TopLevelContent),
  transition(RE_WHITESPACE, TokenType.WhitespaceInsideOpeningTag, State.InsideOpeningTagAfterWhitespace),
  transition(RE_TAG_TEXT, TokenType.Text, State.TopLevelContent),
]

const insideOpeningTagAfterWhitespaceTransitions: readonly Transition[] = [
  transition(RE_ATTRIBUTE_NAME, TokenType.AttributeName, State.AfterAttributeName),
  transition(RE_ANGLE_BRACKET_CLOSE, TokenType.ClosingAngleBracket, State.TopLevelContent),
  transition(RE_SELF_CLOSING, TokenType.ClosingAngleBracket, State.TopLevelContent),
  transition(RE_TEXT, TokenType.AttributeName, State.AfterAttributeName),
]

const topLevelContentTransitions: readonly Transition[] = [
  transition(RE_ANGLE_BRACKET_OPEN_TAG, TokenType.OpeningAngleBracket, State.AfterOpeningAngleBracket),
  transition(RE_CONTENT, TokenType.Content, State.TopLevelContent),
  transition(RE_BLOCK_COMMENT_START, TokenType.CommentStart, State.InsideComment),
  transition(RE_ANGLE_BRACKET_CLOSE, TokenType.Content, State.TopLevelContent),
  transition(RE_ANGLE_BRACKET_OPEN, TokenType.Text, State.TopLevelContent),
]

const getInsideAttributeAfterDoubleQuoteResult = (part: string): TokenizerResult => {
  const attributeValueMatch = part.match(RE_ATTRIBUTE_VALUE_INSIDE_DOUBLE_QUOTE)
  if (attributeValueMatch) {
    return tokenizerResult(attributeValueMatch[0], TokenType.AttributeValue, State.AfterAttributeValueInsideDoubleQuote)
  }
  return matchTransition(part, afterAttributeValueInsideDoubleQuoteTransitions)
}

const stateHandlers: Record<number, StateHandler> = {
  [State.AfterAttributeEqualSign]: (part) => matchTransition(part, afterAttributeEqualSignTransitions),
  [State.AfterAttributeName]: (part) => matchTransition(part, afterAttributeNameTransitions),
  [State.AfterAttributeValueClosingQuote]: (part) => matchTransition(part, afterAttributeValueClosingQuoteTransitions),
  [State.AfterAttributeValueInsideDoubleQuote]: (part) => matchTransition(part, afterAttributeValueInsideDoubleQuoteTransitions),
  [State.AfterClosingTagName]: (part) => matchTransition(part, afterClosingTagNameTransitions),
  [State.AfterClosingTagSlash]: (part) => matchTransition(part, afterClosingTagSlashTransitions),
  [State.AfterExclamationMark]: (part) => matchTransition(part, afterExclamationMarkTransitions),
  [State.AfterOpeningAngleBracket]: (part) => matchTransition(part, afterOpeningAngleBracketTransitions),
  [State.InsideAttributeAfterDoubleQuote]: getInsideAttributeAfterDoubleQuoteResult,
  [State.InsideComment]: (part) => matchTransition(part, insideCommentTransitions),
  [State.InsideOpeningTag]: (part) => matchTransition(part, insideOpeningTagTransitions),
  [State.InsideOpeningTagAfterWhitespace]: (part) => matchTransition(part, insideOpeningTagAfterWhitespaceTransitions),
  [State.TopLevelContent]: (part) => matchTransition(part, topLevelContentTransitions),
}

export const tokenizeHtml = (text: string): readonly HtmlToken[] => {
  Assert.string(text)
  let state = State.TopLevelContent
  let index = 0
  const tokens: HtmlToken[] = []
  while (index < text.length) {
    const part = text.slice(index)
    const handler = stateHandlers[state]
    if (!handler) {
      throw new UnexpectedTokenError()
    }
    const result = handler(part)
    tokens.push({
      text: result.tokenText,
      type: result.type,
    })
    state = result.nextState
    index += result.tokenText.length
  }
  return tokens
}

import { expect, test } from '@jest/globals'
import { getCodeBlockLanguage } from '../src/parts/GetCodeBlockLanguage/GetCodeBlockLanguage.ts'

const languages = [
  {
    extensions: ['.js', '.mjs'],
    id: 'javascript',
    tokenize: '/extensions/javascript/tokenize.js',
  },
  {
    aliases: ['Shell Script', 'shell'],
    extensions: ['.sh', '.bash'],
    id: 'shellscript',
    tokenize: '/extensions/shellscript/tokenize.js',
  },
  {
    id: 'plaintext',
  },
]

test('returns language matching id', () => {
  expect(getCodeBlockLanguage('JavaScript', languages)).toEqual(languages[0])
})

test('returns language matching file extension alias', () => {
  expect(getCodeBlockLanguage('sh', languages)).toEqual(languages[1])
})

test('returns language matching contributed alias', () => {
  expect(getCodeBlockLanguage('shell title=setup', languages)).toEqual(languages[1])
})

test('ignores languages without tokenizers', () => {
  expect(getCodeBlockLanguage('plaintext', languages)).toBeUndefined()
})

test('returns undefined for empty or unknown languages', () => {
  expect(getCodeBlockLanguage('', languages)).toBeUndefined()
  expect(getCodeBlockLanguage('unknown', languages)).toBeUndefined()
})

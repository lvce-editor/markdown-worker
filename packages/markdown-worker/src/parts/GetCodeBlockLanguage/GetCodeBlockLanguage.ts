import type { MarkdownLanguage } from '../MarkDownOptions/MarkDownOptions.ts'

const matchesLanguage = (language: MarkdownLanguage, languageId: string): boolean => {
  if (language.id.toLowerCase() === languageId) {
    return true
  }
  if (language.aliases?.some((alias) => alias.toLowerCase() === languageId)) {
    return true
  }
  return Boolean(language.extensions?.some((extension) => extension.replace(/^\./, '').toLowerCase() === languageId))
}

export const getCodeBlockLanguage = (info: string, languages: readonly MarkdownLanguage[]): MarkdownLanguage | undefined => {
  const languageId = info.trim().split(/\s+/, 1)[0]?.toLowerCase()
  if (!languageId) {
    return undefined
  }
  return languages.find((language) => Boolean(language.tokenize) && matchesLanguage(language, languageId))
}

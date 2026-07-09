/* eslint-disable @typescript-eslint/prefer-readonly-parameter-types */
import { SyntaxHighlightingWorker } from '@lvce-editor/rpc-registry'
import * as marked from 'marked'
import type { MarkDownOptions } from '../MarkDownOptions/MarkDownOptions.ts'
import * as GetCodeBlockLanguage from '../GetCodeBlockLanguage/GetCodeBlockLanguage.ts'
import { joinUrl } from '../JoinUrl/JoinUrl.ts'
import * as RenderHighlightedCodeBlock from '../RenderHighlightedCodeBlock/RenderHighlightedCodeBlock.ts'

const RE_LINK_START = /^<a /

export const renderMarkdown = async (markdown: string, options: MarkDownOptions = {}): Promise<string> => {
  const renderer = new marked.Renderer()
  const highlightedCodeBlocks = new WeakMap<marked.Tokens.Code, string>()
  const codeRenderer = renderer.code.bind(renderer)
  renderer.code = (token): string => {
    return highlightedCodeBlocks.get(token) || codeRenderer(token)
  }
  if (options.linksExternal) {
    const linkRenderer = renderer.link.bind(renderer)
    renderer.link = (link): string => {
      const localLink = link.href.startsWith(`${location.protocol}//${location.hostname}`)
      const html = linkRenderer(link)
      return localLink ? html : html.replace(RE_LINK_START, `<a target="_blank" rel="noreferrer noopener nofollow" `)
    }
  }
  const { baseUrl } = options
  if (baseUrl) {
    const imageRenderer = renderer.image.bind(renderer)
    renderer.image = (image): string => {
      image.href = joinUrl(image.href, baseUrl)
      const html = imageRenderer(image)
      return html
    }
  }
  const walkTokens = async (token: marked.Token): Promise<void> => {
    if (token.type !== 'code' || !token.lang) {
      return
    }
    const codeToken = token as marked.Tokens.Code
    const languageId = codeToken.lang as string
    const language = GetCodeBlockLanguage.getCodeBlockLanguage(languageId, options.languages || [])
    if (!language?.tokenize) {
      return
    }
    try {
      const lineInfos = await SyntaxHighlightingWorker.invoke('Tokenizer.tokenizeCodeBlock', codeToken.text, language.id, language.tokenize)
      if (Array.isArray(lineInfos)) {
        const codeBlockLanguageId = languageId.trim().split(/\s+/, 1)[0]
        highlightedCodeBlocks.set(codeToken, RenderHighlightedCodeBlock.renderHighlightedCodeBlock(codeBlockLanguageId, lineInfos))
      }
    } catch {
      // Keep the normal escaped code block when syntax highlighting is unavailable.
    }
  }
  const html = await marked.marked(markdown, { async: true, renderer, walkTokens })
  return html
}

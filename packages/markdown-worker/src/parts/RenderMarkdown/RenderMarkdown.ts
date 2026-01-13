/* eslint-disable @typescript-eslint/prefer-readonly-parameter-types */
import * as marked from 'marked'
import type { MarkDownOptions } from '../MarkDownOptions/MarkDownOptions.ts'
import { joinUrl } from '../JoinUrl/JoinUrl.ts'

const RE_LINK_START = /^<a /

export const renderMarkdown = async (markdown: string, options: MarkDownOptions = {}): Promise<string> => {
  const renderer = new marked.Renderer()
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
  const html = await marked.marked(markdown, { renderer })
  return html
}

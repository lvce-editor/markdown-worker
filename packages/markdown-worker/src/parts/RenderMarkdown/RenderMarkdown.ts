/* eslint-disable @typescript-eslint/prefer-readonly-parameter-types */
import * as marked from 'marked'

export interface MarkDownOptions {
  readonly baseUrl?: string
  readonly linksExternal?: boolean
}

export const renderMarkdown = async (markdown: string, options: MarkDownOptions = {}): Promise<string> => {
  const renderer = new marked.Renderer()
  if (options.linksExternal) {
    const linkRenderer = renderer.link.bind(renderer)
    renderer.link = (link): string => {
      const localLink = link.href.startsWith(`${location.protocol}//${location.hostname}`)
      const html = linkRenderer(link)
      return localLink ? html : html.replace(/^<a /, `<a target="_blank" rel="noreferrer noopener nofollow" `)
    }
  }
  const html = await marked.marked(markdown, { renderer })
  return html
}

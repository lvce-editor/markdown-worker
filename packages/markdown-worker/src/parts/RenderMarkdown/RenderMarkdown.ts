import * as marked from 'marked'

export interface MarkDownOptions {
  readonly baseUrl?: string
  readonly linksExternal?: boolean
}

export const renderMarkdown = async (markdown: string, options: MarkDownOptions = {}): Promise<string> => {
  const renderer = new marked.Renderer()
  if (options.linksExternal) {
    const linkRenderer = renderer.link
    renderer.link = (link): string => {
      const localLink = link.href.startsWith(`${location.protocol}//${location.hostname}`)
      const html = linkRenderer.call(renderer, link)
      return localLink ? html : html.replace(/^<a /, `<a target="_blank" rel="noreferrer noopener nofollow" `)
    }
  }
  const html = await marked.marked(markdown, { renderer })
  return html
}

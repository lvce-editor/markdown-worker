export interface MarkdownLanguage {
  readonly aliases?: readonly string[]
  readonly extensions?: readonly string[]
  readonly id: string
  readonly tokenize?: string
}

export interface MarkDownOptions {
  readonly baseUrl?: string
  readonly languages?: readonly MarkdownLanguage[]
  readonly linksExternal?: boolean
}

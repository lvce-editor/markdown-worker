const escapeHtml = (value: string): string => {
  return value.replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;').replaceAll("'", '&#39;')
}

const renderLine = (line: readonly string[]): string => {
  let html = ''
  for (let index = 0; index < line.length; index += 2) {
    const text = line[index] || ''
    const className = line[index + 1] || 'Token Unknown'
    html += `<span class="${escapeHtml(className)}">${escapeHtml(text)}</span>`
  }
  return html
}

export const renderHighlightedCodeBlock = (languageId: string, lineInfos: readonly (readonly string[])[]): string => {
  const code = lineInfos.map(renderLine).join('\n')
  return `<pre><code class="language-${escapeHtml(languageId)}">${code}\n</code></pre>\n`
}

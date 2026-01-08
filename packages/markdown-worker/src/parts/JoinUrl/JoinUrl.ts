export const joinUrl = (relativePath: string, baseUrl: string): string => {
  if (relativePath.startsWith('http:') || relativePath.startsWith('https:')) {
    return relativePath
  }
  if (relativePath.startsWith('./')) {
    if (baseUrl.endsWith('/')) {
      return `${baseUrl}${relativePath.slice(2)}`
    }
    return `${baseUrl}/${relativePath.slice(2)}`
  }
  return `${baseUrl}/${relativePath}`
}

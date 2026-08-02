export const parseText = (text: string): string => {
  return text.replaceAll('&gt;', '>').replaceAll('&lt;', '<').replaceAll('&quot;', '"').replaceAll('&#39;', "'").replaceAll('&amp;', '&')
}

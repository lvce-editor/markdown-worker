export const getVirtualDomChildCount = (markdownDom: any): number => {
  const max = markdownDom.length - 1
  let stack: any[] = []
  for (let i = max; i >= 0; i--) {
    const element = markdownDom[i]
    if (element.childCount > 0) {
      stack = stack.slice(element.childCount)
    }
    stack.unshift(element)
  }
  return stack.length
}

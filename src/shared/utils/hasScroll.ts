export function hasScroll(element: HTMLElement) {
  return {
    hasHorizontalScroll: element.scrollWidth > element.offsetWidth,
    hasVerticalScroll: element.scrollHeight > element.offsetHeight
  }
}
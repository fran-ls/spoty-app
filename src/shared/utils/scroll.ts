export function hasScroll(element: HTMLElement) {
  return {
    hasHorizontalScroll: element.scrollWidth > element.offsetWidth,
    hasVerticalScroll: element.scrollHeight > element.offsetHeight
  }
}

export function getScrollbarWidth() {
  return window.innerWidth - document.documentElement.clientWidth;
}

export function getElementScrollbarWidth(element: HTMLElement) {
  if (!element) return {
    width: 0,
    height: 0
  }

  return {
    width: element.offsetWidth - element.clientWidth,
    height: element.offsetHeight - element.clientHeight
  }
}
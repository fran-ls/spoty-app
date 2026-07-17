export function hasScroll(element: HTMLElement) {
  return {
    horizontal: element.scrollWidth > element.clientWidth,
    vertical: element.scrollHeight > element.clientHeight
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
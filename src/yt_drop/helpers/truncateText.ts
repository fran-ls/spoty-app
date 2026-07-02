import { getStyles } from "./getStyles.ts";

const setPaddingAndMarginInline = (styles: Record<string, any>) => {
  const styleList = 'padding-inline margin-inline';

  const newStyles = structuredClone(styles);

  styleList.split(' ').forEach((s) => {
    newStyles[s] = styles[s] ? styles[s] * 2 : 0;
  });

  return newStyles;
}

export const truncateTitle1 = (parentSelector: string, element: HTMLElement) => {
  if (!parentSelector || !element) return;

  const parent = element.closest(parentSelector) as HTMLElement;
  if (!parent) return;

  const titleSection = element.querySelector('.hist-title') as HTMLElement;
  const img = element.querySelector('.hist-thumb') as HTMLElement;
  const title = element.querySelector('.h-title') as HTMLElement;
  const url = element.querySelector('.hist-url') as HTMLElement;
  const badge = element.querySelector('.hist-badge') as HTMLElement;
  const btnDl = element.querySelector('.dl-btn') as HTMLElement;
  const meta = element.querySelector('.hist-meta') as HTMLElement;

  const imgW = img!.offsetWidth || 0;
  const badgeW = badge!.offsetWidth || 0;

  let titleWidth: number = parent.clientWidth;

  const parentStyles = getStyles({
    element: parent,
    styleList: 'padding-inline margin-inline',
    parse: true
  });

  const cardStyles = getStyles({
    element,
    styleList: 'padding-inline gap',
    parse: true
  });

  const titleSectionStyles = getStyles({
    element: titleSection,
    styleList: 'padding-inline gap',
    parse: true
  });

  const btnDlStyles = getStyles({
    element: btnDl,
    styleList: 'width height',
    parse: true
  });

  let btnWidth = btnDlStyles.width;
  const btnHeight = btnDlStyles.height;

  if (btnWidth > btnHeight) {
    btnDl.style.height = btnWidth + 'px';
  }
  else {
    btnDl.style.width = btnHeight + 'px';
    btnWidth = btnHeight;
  }

  const parentStyles1 = setPaddingAndMarginInline(parentStyles);
  for (let s in parentStyles1) {
    titleWidth = titleWidth - parentStyles1[s];
  }

  const cardStyles1 = setPaddingAndMarginInline(cardStyles);
  for (let s in cardStyles1) {
    titleWidth = titleWidth - cardStyles1[s];
  }

  const titleSectionStyles1 = setPaddingAndMarginInline(titleSectionStyles);
  for (let s in titleSectionStyles1) {
    titleWidth = titleWidth - titleSectionStyles1[s];
  }

  titleWidth = titleWidth - imgW - badgeW - btnWidth;
  const urlMaxWidth = `${titleWidth + badgeW}px`;

  title.style.maxWidth = `${titleWidth - 10}px`;
  url.style.maxWidth = urlMaxWidth;
  meta.style.maxWidth = urlMaxWidth;
}

export const truncateTitle = (parent: HTMLElement, element: HTMLElement) => {
  if (!parent || !element) return;

  const titleSection = element.querySelector('.hist-title') as HTMLElement;
  const img = element.querySelector('.hist-thumb') as HTMLElement;
  const title = element.querySelector('.h-title') as HTMLElement;
  const url = element.querySelector('.hist-url') as HTMLElement;
  const badge = element.querySelector('.hist-badge') as HTMLElement;
  const btnDl = element.querySelector('.dl-btn') as HTMLElement;
  const meta = element.querySelector('.hist-meta') as HTMLElement;

  const imgW = img!.offsetWidth || 0;
  const badgeW = badge!.offsetWidth || 0;

  let titleWidth: number = parent.clientWidth;

  const parentStyles = getStyles({
    element: parent,
    styleList: 'padding-inline margin-inline',
    parse: true
  });

  const cardStyles = getStyles({
    element,
    styleList: 'padding-inline gap',
    parse: true
  });

  const titleSectionStyles = getStyles({
    element: titleSection,
    styleList: 'padding-inline gap',
    parse: true
  });

  const btnDlStyles = getStyles({
    element: btnDl,
    styleList: 'width height',
    parse: true
  });

  let btnWidth = btnDlStyles.width;
  const btnHeight = btnDlStyles.height;

  if (btnWidth > btnHeight) {
    btnDl.style.height = btnWidth + 'px';
  }
  else {
    btnDl.style.width = btnHeight + 'px';
    btnWidth = btnHeight;
  }

  const parentStyles1 = setPaddingAndMarginInline(parentStyles);
  for (let s in parentStyles1) {
    titleWidth = titleWidth - parentStyles1[s];
  }

  const cardStyles1 = setPaddingAndMarginInline(cardStyles);
  for (let s in cardStyles1) {
    titleWidth = titleWidth - cardStyles1[s];
  }

  const titleSectionStyles1 = setPaddingAndMarginInline(titleSectionStyles);
  for (let s in titleSectionStyles1) {
    titleWidth = titleWidth - titleSectionStyles1[s];
  }

  titleWidth = titleWidth - imgW - badgeW - btnWidth;
  const urlMaxWidth = `${titleWidth + badgeW}px`;

  title.style.maxWidth = `${titleWidth - 10}px`;
  url.style.maxWidth = urlMaxWidth;
  meta.style.maxWidth = urlMaxWidth;
}

let allItems: NodeListOf<Element>[] | null = null;

export const setAllItems = (parent: Element) => {
  if (allItems || !parent) return;
  allItems = parent.querySelectorAll(`.hist-item`) as any;
}

export const truncateTitleAll = (parent: HTMLElement) => {
  if (!parent || !allItems || !allItems?.length) return;

  allItems.forEach((item: any) => {
    if (item) truncateTitle(parent, item);
  });
}

export const truncateText = (element: HTMLElement, sizeList: string) => {
  if (!element || !sizeList) return;

  let width: number = element.clientWidth;

  for (const v of sizeList.split(' ')) {
    const s = Number(v.replace(/[^0-9.]/g, ''));
    width += s;
  }

  element.style.width = width + 'px';
}
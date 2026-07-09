export type Style = string | React.CSSProperties;

export interface ItemStyle {
  style: React.CSSProperties | undefined;
  className: string;
}

export function getStyles(style: Style | undefined): ItemStyle {
  if (!style) return {
    style: undefined,
    className: ''
  }

  const isString = typeof style === 'string';

  return {
    style: !isString ? style : undefined,
    className: isString ? style : ''
  }
}
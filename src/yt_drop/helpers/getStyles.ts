interface Payload {
  selector?: string;
  element?: Element;
  styleList?: string;
  parse?: boolean;
}

export const getStyles = (payload: Payload) => {
  const {
    selector,
    element = undefined,
    styleList = "",
    parse = false,
  } = payload;

  const el = selector ? document.querySelector(selector) : element;
  if (!el) return {}

  const selectedStyles = styleList.trim() ? styleList.split(" ") : [];
  const allStyles: any = getComputedStyle(el);
  const styles: any = {}

  if (!selectedStyles.length) return allStyles;

  for (const k of selectedStyles) {
    const [s, p = "false"] = k.split(":");

    if (s in allStyles) {
      const v = allStyles[s];
      styles[s] =
        p === "true" || parse ? Number(v.replace(/[^0-9.,]/g, "")) : v;
    }
  }

  return styles;
}

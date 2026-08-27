export type ColorFormat = 'rgb' | 'rgba' | 'hex' | 'hexa' | 'hsl' | 'hsla';

export function convertColor(color: string, to: ColorFormat, opacity?: number) {
  // Crear un elemento temporal para que el navegador interprete el color
  const temp = document.createElement("div");
  temp.style.color = color;
  document.body.appendChild(temp);

  const computed = getComputedStyle(temp).color;
  document.body.removeChild(temp);

  if (!computed) return '';

  const [r, g, b, a = 1] = computed.match(/[\d.]+/g)?.map(Number) || [];

  switch (to.toLowerCase()) {
    case "rgb":
      return opacity != null ? `rgb(${r}, ${g}, ${b}, ${opacity})` : `rgb(${r}, ${g}, ${b})`;

    case "rgba":
      return `rgba(${r}, ${g}, ${b}, ${opacity != null ? opacity : a})`;

    case "hex":
      return (
        "#" +
        [r, g, b]
          .map(v => v.toString(16).padStart(2, "0"))
          .join("")
          .toUpperCase()
      );

    case "hexa":
      return (
        "#" +
        [r, g, b, Math.round(a * 255)]
          .map(v => v.toString(16).padStart(2, "0"))
          .join("")
          .toUpperCase()
      );

    case "hsl":
    case "hsla": {
      const rNorm = r / 255;
      const gNorm = g / 255;
      const bNorm = b / 255;

      const max = Math.max(rNorm, gNorm, bNorm);
      const min = Math.min(rNorm, gNorm, bNorm);
      const delta = max - min;

      let h = 0;
      let s = 0;
      const l = (max + min) / 2;

      if (delta !== 0) {
        s = delta / (1 - Math.abs(2 * l - 1));

        switch (max) {
          case rNorm:
            h = 60 * (((gNorm - bNorm) / delta) % 6);
            break;
          case gNorm:
            h = 60 * ((bNorm - rNorm) / delta + 2);
            break;
          case bNorm:
            h = 60 * ((rNorm - gNorm) / delta + 4);
            break;
        }
      }

      h = Math.round(h < 0 ? h + 360 : h);
      s = Math.round(s * 100);
      const lightness = Math.round(l * 100);

      return to === "hsla"
        ? `hsla(${h}, ${s}%, ${lightness}%, ${a})`
        : opacity != null ? `hsl(${h} ${s}% ${lightness}% / ${opacity}%)` : `hsl(${h}, ${s}%, ${lightness}%)`;
    }

    default:
      throw new Error(`Formato no soportado: ${to}`);
  }
}

export function hexToRgb(hex: string, opacity?: number) {
  hex = hex.replace('#', '');
  const r = parseInt(hex.slice(0, 2), 16);
  const g = parseInt(hex.slice(2, 4), 16);
  const b = parseInt(hex.slice(4, 6), 16);
  return opacity != null ? `rgb(${r}, ${g}, ${b}, ${opacity})` : `rgb(${r}, ${g}, ${b})`;
}
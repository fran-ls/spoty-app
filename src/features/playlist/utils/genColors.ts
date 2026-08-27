import { convertColor, type ColorFormat } from "./convertColor";

type Colors = {
  bg: string;
  base: string;
  base40: string;
}

export function genColors(format: ColorFormat = 'hsl'): Colors {
  const hue = Math.floor(Math.random() * 360);
  const colors = {
    bg: `hsl(${hue}, 100%, 44%)`,
    base: `hsl(${hue}, 100%, 28%)`,
    base40: `hsl(${hue} 100% 44% / 40%)`
  }

  return format === 'hsl' ? colors : {
    bg: convertColor(colors.bg, format),
    base: convertColor(colors.base, format),
    base40: convertColor(colors.base40, format)
  }

  // dark: `hsl(${hue}, 80%, 30%)`,
  // medium: `hsl(${hue}, 80%, 45%)`,
  // light: `hsl(${hue}, 80%, 60%)`
}

// export function genColors() {
//   const random = (end: number) => Math.floor((Math.random() * end) + 1);
//   const r = random(224);
//   const g = random(224);
//   const b = random(224);

//   return {
//     bg: `rgb(${r}, ${g}, ${b})`,
//     base: `rgb(${r}, ${random(143)}, ${b})`
//   }
// }
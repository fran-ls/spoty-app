export const GRADIENT_COLORS = [
  { color: '#8b1321', pos: 0 },
  { color: '#1d0205', pos: 50 },
  { color: "#131313", pos: 100 }
];

const direction = 'to bottom';
const sorted = [...GRADIENT_COLORS].sort((a, b) => a.pos - b.pos);
const gradientStops = sorted.map((s) => `${s.color} ${s.pos}%`).join(", ");

export const GRADIENT_CSS = `linear-gradient(${direction}, ${gradientStops})`;

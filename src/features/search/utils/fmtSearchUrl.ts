type Args = {
  text: string;
  reverse?: boolean;
}

export const fmtSearchUrl = ({ text, reverse = false }: Args) => {
  if (!text) return '';
  const separator = '+';
  return reverse ? text.trim().replaceAll(separator, ' ') : text.trim().replaceAll(' ', separator);
}
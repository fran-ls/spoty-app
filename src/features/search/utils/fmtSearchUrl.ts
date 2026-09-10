type Args = {
  text: string;
  reverse?: boolean;
}

export const fmtSearchUrl = ({ text, reverse = false }: Args) => {
  if (!text) return '';

  if (reverse) {
    return text.split('=')[1].replaceAll('-', ' ');
  }

  return text.split('=')[1].replaceAll(' ', '-');
}
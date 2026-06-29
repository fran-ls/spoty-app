export function getValue(obj: any, path: string): any {
  const normalized = path
    .replace(/\[(\d+)\]/g, '.$1') // [0] -> .0
    .replace(/\[['"]([^'"]+)['"]\]/g, '.$1') // ['a'] -> .a
    .replace(/^\./, '');

  return normalized
    .split('.')
    .filter(Boolean)
    .reduce((acc, key) => acc?.[key], obj);
}
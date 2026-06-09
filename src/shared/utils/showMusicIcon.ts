export const showMusicIcon = (element: HTMLElement, selector: string) => {
  const ev = element;
  ev.style.display = 'none';
  const icon = ev.closest(selector)?.querySelector('.music-icon');
  if (icon) icon.classList.remove('hidden', 'opacity-0');
}
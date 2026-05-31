export const formatTime = (secs: number) => {
  const minutes = Math.floor(secs / 60);
  const remains = Math.floor(secs % 60);
  return `${minutes}:${remains < 10 ? '0' : ''}${remains}`;
}
export const formatTime = (secs: number) => {
  const minutes = Math.floor(secs / 60);
  const remains = Math.floor(secs % 60);
  return `${minutes}:${remains < 10 ? '0' : ''}${remains}`;
}

export const getTimeParts = (duration: number) => {
  const hours = Math.floor(duration / 3600);
  const minutes = Math.floor((duration % 3600) / 60);
  const seconds = duration % 60;

  return {
    hours,
    min: minutes,
    secs: seconds,
    stringSecs: `${seconds < 10 ? '0' : ''}${seconds}`
  }
}
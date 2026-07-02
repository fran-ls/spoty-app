export function normalizeYouTubeUrl(url: string) {
  if (!url) return null;

  const cleanText = url.replace(/\s+/g, "").trim();

  // Regex para capturar el ID del video
  const match = cleanText.match(
    /(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/|v\/))([a-zA-Z0-9_-]{11})/
  );

  if (!match) return null; // no es una URL válida de YouTube

  const videoId = match[1];

  // Construir URL normalizada
  return `https://www.youtube.com/watch?v=${videoId}`;
}
export function fmtDuration(s: number) {
  if (!s) return '';
  const m = Math.floor(s / 60), sec = s % 60;
  return `${m}:${String(sec).padStart(2, '0')}`;
}

export function fmtSize(b: number) {
  if (!b) return '';
  if (b > 1e9) return (b / 1e9).toFixed(2) + ' GB';
  if (b > 1e6) return (b / 1e6).toFixed(1) + ' MB';
  return Math.round(b / 1e3) + ' KB';
}

export function fmtViews(v: number) {
  if (!v) return '';
  if (v > 1e6) return (v / 1e6).toFixed(1) + 'M views';
  if (v > 1e3) return (v / 1e3).toFixed(0) + 'K views';
  return v + ' views';
}

export function fmtDate(iso: Date) {
  if (!iso) return '';

  try {
    const date = new Date(iso).toLocaleString('es-SV', {
      timeZone: 'utc',
      dateStyle: 'medium',
      timeStyle: 'short'
    });

    const parts = date.split(', ');
    const times = parts[1].split(' ');

    const fmtDate = parts[0].split(' ');
    const p = times[1].includes('p') ? 'PM' : times[1].includes('a') ? 'AM' : ''

    return `${fmtDate[0].padStart(2, '0')}/${fmtDate[1]}/${fmtDate[2]} ${times[0]} ${p}`;
  }
  catch (e) {
    return iso.toDateString();
  }
}

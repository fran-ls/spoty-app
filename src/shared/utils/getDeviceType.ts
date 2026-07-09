export function getDeviceType() {
  const userAgent = navigator.userAgent;

  if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(userAgent)) {
    return 'movil';
  } else if (/Tablet|iPad/i.test(userAgent)) {
    return 'tablet';
  } else {
    return 'desktop';
  }
}
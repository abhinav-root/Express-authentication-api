export function getUTCTimestamp() {
  return Math.floor(new Date().getTime() / 1000);
}

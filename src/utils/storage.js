const READING_MODE_KEY = 'palabra-viva-reading-mode';

export function getReadingMode() {
  return localStorage.getItem(READING_MODE_KEY) === 'true';
}

export function setReadingMode(value) {
  localStorage.setItem(READING_MODE_KEY, String(Boolean(value)));
}

import { apiUrl } from './apiClient';

export function getTtsUrl(date, options = {}) {
  const {
    section = 'gospel',
    voice = '',
    rate = 1,
    format = 'mp3'
  } = options;

  const params = new URLSearchParams({
    section,
    rate: String(rate),
    format
  });

  if (voice) {
    params.set('voice', voice);
  }

  const path = `/api/v1/tts/date/${encodeURIComponent(date)}?${params.toString()}`;
  return apiUrl(path);
}

export function mapTtsErrorMessage(status) {
  if (!status) return 'No se pudo conectar con el servicio de audio';
  if (status === 404) return 'No hay audio disponible para esta fecha';
  if (status === 503) return 'Servicio de audio no disponible temporalmente';
  return 'No se pudo reproducir el audio del evangelio';
}

import { API_BASE_URL } from './apiClient';

const API_PREFIX = '/api/v1';

function trimTrailingSlash(value = '') {
  return value.replace(/\/+$/, '');
}

function resolveApiBase() {
  const rawBase = trimTrailingSlash(API_BASE_URL || '');

  if (!rawBase) {
    return API_PREFIX;
  }

  return rawBase.endsWith(API_PREFIX) ? rawBase : `${rawBase}${API_PREFIX}`;
}

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

  const base = resolveApiBase();
  return `${base}/tts/date/${encodeURIComponent(date)}?${params.toString()}`;
}

export function mapTtsErrorMessage(status) {
  if (status === 404) return 'No hay audio disponible para esta fecha';
  if (status === 503) return 'Servicio de audio no disponible temporalmente';
  return 'No se pudo reproducir el audio del evangelio';
}

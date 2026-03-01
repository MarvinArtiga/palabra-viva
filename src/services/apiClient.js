import axios from 'axios';

function trimTrailingSlash(value = '') {
  return value.replace(/\/+$/, '');
}

export const API_BASE = trimTrailingSlash(import.meta.env.VITE_API_BASE_URL ?? '');

export function resolveApiUrl(path = '') {
  if (!path) return API_BASE;
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  return API_BASE ? `${API_BASE}${normalizedPath}` : normalizedPath;
}

const apiClient = axios.create({
  baseURL: API_BASE,
  timeout: 10_000
});

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (import.meta.env.DEV) {
      console.error('API request failed', {
        url: error.config?.url,
        method: error.config?.method,
        status: error.response?.status,
        message: error.message
      });
    }
    return Promise.reject(error);
  }
);

export async function getWeekReadings(dateStr) {
  const { data } = await apiClient.get(`/api/v1/readings/week/${dateStr}`);
  return data;
}

export default apiClient;

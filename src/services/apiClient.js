import axios from 'axios';

function trimTrailingSlash(value = '') {
  return value.replace(/\/+$/, '');
}

const apiBaseUrl = trimTrailingSlash(
  import.meta.env.VITE_API_BASE_URL || import.meta.env.VITE_API_URL || ''
);

export function resolveApiUrl(path = '') {
  if (!path) return apiBaseUrl;
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  return apiBaseUrl ? `${apiBaseUrl}${normalizedPath}` : normalizedPath;
}

const apiClient = axios.create({
  baseURL: apiBaseUrl,
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
  const { data } = await apiClient.get(`/readings/week/${dateStr}`);
  return data;
}

export const API_BASE_URL = apiBaseUrl;
export default apiClient;

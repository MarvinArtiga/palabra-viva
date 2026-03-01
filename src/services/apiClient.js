import axios from 'axios';

export const API_BASE = import.meta.env.VITE_API_BASE_URL?.replace(/\/$/, '') || '';
export const apiUrl = (path = '') => `${API_BASE}${path.startsWith('/') ? '' : '/'}${path}`;

const apiClient = axios.create({
  baseURL: API_BASE || undefined,
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
  const { data } = await apiClient.get(apiUrl(`/api/v1/readings/week/${dateStr}`));
  return data;
}

export default apiClient;

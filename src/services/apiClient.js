import axios from 'axios';

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
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

export default apiClient;

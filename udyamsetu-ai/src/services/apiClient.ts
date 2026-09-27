import axios, { AxiosInstance, AxiosResponse, InternalAxiosRequestConfig } from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

const useMockApi = import.meta.env.VITE_USE_MOCK_API === 'true';

if (API_BASE_URL.includes('localhost') || API_BASE_URL.includes('127.0.0.1')) {
  if (typeof window !== 'undefined' && window.location.hostname !== 'localhost') {
    console.warn('API URL is set to a localhost address but the app is running on a non-localhost domain. API requests will fail.');
  }
}

export const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem('access_token');
    if (token) {
      config.headers.set('Authorization', `Bearer ${token}`);
    }
    return config;
  },
  (error) => Promise.reject(error)
);

interface FailedRequest {
  resolve: (value: AxiosResponse) => void;
  reject: (reason: unknown) => void;
}

let isRefreshing = false;
let failedQueue: FailedRequest[] = [];

const processQueue = (error: unknown, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      if (token) {
        prom.resolve({} as AxiosResponse);
      }
    }
  });
  failedQueue = [];
};

apiClient.interceptors.response.use(
  (response: AxiosResponse) => {
    const data = response.data;
    if (data && typeof data === 'object' && 'success' in data) {
      if (!data.success) {
        return Promise.reject(new Error(data.message || 'Request failed'));
      }
      return response;
    }
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    if (!error.response) {
      const networkError = new Error(
        'Unable to connect to server. Please check your internet connection or try again.'
      );
      networkError.name = 'NetworkError';
      throw networkError;
    }

    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({
            resolve: (response: AxiosResponse) => resolve(response),
            reject: (err: unknown) => reject(err),
          });
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const refreshToken = localStorage.getItem('refresh_token');
        if (refreshToken) {
          const response = await axios.post(
            `${API_BASE_URL}/auth/refresh`,
            { refreshToken },
            { timeout: 10000 }
          );
          const { accessToken } = response.data.data;
          localStorage.setItem('access_token', accessToken);
          originalRequest.headers.Authorization = `Bearer ${accessToken}`;
          processQueue(null, accessToken);
          return apiClient(originalRequest);
        }
      } catch (refreshError) {
        processQueue(refreshError, null);
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        window.location.href = '/login';
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    const status = error.response.status;
    const backendMessage = error.response.data?.message;
    const apiError = new Error(
      status >= 500
        ? 'Something went wrong. Please try again later.'
        : backendMessage || 'Something went wrong. Please try again.'
    );
    apiError.name = 'ApiError';
    (apiError as Error & { status?: number }).status = status;
    return Promise.reject(apiError);
  }
);

export function isMockApi(): boolean {
  return useMockApi;
}

export { API_BASE_URL };

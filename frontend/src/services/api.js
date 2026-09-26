import axios from 'axios';
import { getAccessToken, getRefreshToken, setTokens, removeTokens } from '../utils/tokenStorage';

const api = axios.create({
  baseURL: '/api/v1',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request Interceptor: Inject JWT token into Authorization header
api.interceptors.request.use(
  (config) => {
    const token = getAccessToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor: Unwrap ApiResponse and handle 401 token refresh
api.interceptors.response.use(
  (response) => {
    // If response follows ApiResponse<T> schema { status, message, data }
    if (response.data && typeof response.data === 'object' && 'data' in response.data) {
      return response.data;
    }
    return response.data;
  },
  async (error) => {
    const originalRequest = error.config;

    // Handle HTTP 401 Unauthorized with token refresh mechanism
    if (error.response?.status === 401 && !originalRequest._retry && !originalRequest.url.includes('/auth/login')) {
      originalRequest._retry = true;
      try {
        const refreshToken = getRefreshToken();
        if (refreshToken) {
          const refreshResponse = await axios.post(
            '/api/v1/auth/refresh',
            {},
            {
              headers: {
                'X-Refresh-Token': refreshToken,
              },
            }
          );

          const { accessToken, refreshToken: newRefresh } = refreshResponse.data.data;
          setTokens(accessToken, newRefresh);

          originalRequest.headers.Authorization = `Bearer ${accessToken}`;
          return api(originalRequest);
        }
      } catch (refreshErr) {
        removeTokens();
        window.location.href = '/login';
        return Promise.reject(refreshErr);
      }
    }

    // Standardize backend error response extraction
    const backendMessage = error.response?.data?.message || error.message || 'An unexpected error occurred';
    return Promise.reject({
      status: error.response?.status || 500,
      message: backendMessage,
      raw: error.response?.data,
    });
  }
);

export default api;

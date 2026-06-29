import axios from 'axios';
import Cookies from 'js-cookie';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1';

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, 
});

apiClient.interceptors.request.use(
  (config) => {
    const token = Cookies.get('accessToken'); 

    if (token) {
      const bearerToken = token.startsWith('Bearer ') ? token : `Bearer ${token}`;
      config.headers.Authorization = bearerToken;
    }

    // Let the browser set the Content-Type automatically for FormData so it includes the boundary
    if (config.data instanceof FormData) {
      delete config.headers['Content-Type'];
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor to handle token expiration
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const isAuthRoute = error.config?.url?.includes('/auth/signin') || error.config?.url?.includes('/auth/signup');
    if (error.response?.status === 401 && !isAuthRoute) {
      // Clear the token and redirect to login
      if (typeof document !== 'undefined') {
        document.cookie = 'accessToken=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
        document.cookie = 'Authorization=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
        if (!window.location.pathname.includes('/auth/login')) {
          window.location.href = '/auth/login';
        }
      }
    }
    return Promise.reject(error);
  }
);

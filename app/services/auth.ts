import { SignupResponse, SignupRequest, SigninRequest, SigninResponse } from '@/types/auth';
import axios from 'axios';
import Cookies from 'js-cookie';

const API_BASE_URL = 'https://chefio-beta.vercel.app/api/v1';

// Create axios instance with default config
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Helper function to get access token from Authorization cookie
export const getAccessToken = () => {
  const cookies = document.cookie.split(';');
  const authCookie = cookies.find(cookie => cookie.trim().startsWith('Authorization='));
  if (!authCookie) return null;
  // Remove 'Authorization=' and trim, then strip 'Bearer ' if present
  return decodeURIComponent(authCookie.split('=')[1].trim().replace(/^Bearer /, ''));
};

// Helper function to get refresh token
export const getRefreshToken = () => {
  const cookies = document.cookie.split(';');
  const refreshCookie = cookies.find(cookie => cookie.trim().startsWith('refreshToken='));
  if (!refreshCookie) return null;
  return decodeURIComponent(refreshCookie.split('=')[1].trim());
};

// Function to proactively refresh the token
const proactiveRefreshToken = async () => {
  const accessToken = getAccessToken();
  const refreshToken = getRefreshToken();

  if (accessToken && refreshToken) {
    try {
      const response = await api.post('/auth/refresh-token', { refreshToken });
      const { accessToken: newAccessToken } = response.data;

      // Update tokens in cookies
      const rawToken = newAccessToken.replace(/^Bearer /, '');
      document.cookie = `accessToken=${rawToken}; path=/; max-age=900; Secure; SameSite=Strict`;
      document.cookie = `Authorization=Bearer ${rawToken}; path=/; max-age=900; Secure; SameSite=Strict`;
      
      if (response.data.refreshToken) {
        document.cookie = `refreshToken=${response.data.refreshToken}; path=/; max-age=604800; Secure; SameSite=Strict`;
      }
      console.log('Access token proactively refreshed.');
    } catch (error) {
      console.error('Proactive token refresh failed:', error);
      // If proactive refresh fails, log out the user
      document.cookie = 'accessToken=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
      document.cookie = 'Authorization=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
      document.cookie = 'refreshToken=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
      window.location.href = '/auth/login';
    }
  }
};

// Set up interval for proactive refresh (every 10 minutes)
setInterval(proactiveRefreshToken, 10 * 60 * 1000); 

// Add request interceptor to add token to all requests
api.interceptors.request.use((config) => {
  const token = getAccessToken();
  if (token) {
    // Only add 'Bearer ' if not already present
    config.headers.Authorization = token.startsWith('Bearer ') ? token : `Bearer ${token}`;
    // Always store the raw JWT in accessToken, and 'Bearer <token>' in Authorization cookie
    const rawToken = token.replace(/^Bearer /, '');
    document.cookie = `accessToken=${rawToken}; path=/; max-age=900; Secure; SameSite=Strict`;
    document.cookie = `Authorization=Bearer ${rawToken}; path=/; max-age=900; Secure; SameSite=Strict`;
  }
  return config;
});

// Flag to prevent multiple refresh attempts
let isRefreshing = false;
// Store pending requests
let failedQueue: any[] = [];

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach(prom => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

// Add response interceptor to handle token expiration
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        // If refresh is in progress, add request to queue
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then(token => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            return api(originalRequest);
          })
          .catch(err => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const refreshToken = getRefreshToken();
        if (!refreshToken) {
          throw new Error('No refresh token available');
        }

        const response = await api.post('/auth/refresh-token', { refreshToken });
        const { accessToken } = response.data;

        // Update tokens in cookies
        const rawToken = accessToken.replace(/^Bearer /, '');
        document.cookie = `accessToken=${rawToken}; path=/; max-age=900; Secure; SameSite=Strict`;
        document.cookie = `Authorization=Bearer ${rawToken}; path=/; max-age=900; Secure; SameSite=Strict`;
        
        // Store refresh token if provided
        if (response.data.refreshToken) {
          document.cookie = `refreshToken=${response.data.refreshToken}; path=/; max-age=604800; Secure; SameSite=Strict`;
        }

        // Update Authorization header
        originalRequest.headers.Authorization = `Bearer ${rawToken}`;
        
        // Process queued requests
        processQueue(null, rawToken);
        
        return api(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError, null);
        // Clear tokens and redirect to login
        document.cookie = 'accessToken=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
        document.cookie = 'Authorization=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
        document.cookie = 'refreshToken=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
        window.location.href = '/auth/login';
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }
    return Promise.reject(error);
  }
);

export const authService = {
  async signin(data: SigninRequest): Promise<SigninResponse> {
    try {
      const response = await api.post('/auth/signin', data);
      if (response.data.accessToken) {
        // Store the access token in both cookies with 15 minutes expiration
        const rawToken = response.data.accessToken.replace(/^Bearer /, '');
        document.cookie = `accessToken=${rawToken}; path=/; max-age=900; Secure; SameSite=Strict`;
        document.cookie = `Authorization=Bearer ${rawToken}; path=/; max-age=900; Secure; SameSite=Strict`;
        
        // Store refresh token if provided
        if (response.data.refreshToken) {
          document.cookie = `refreshToken=${response.data.refreshToken}; path=/; max-age=604800; Secure; SameSite=Strict`;
        }
      }
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || error.message || 'Failed to sign in');
    }
  },

  async signup(data: SignupRequest): Promise<SignupResponse> {
    try {
      const response = await api.post('/auth/signup', data);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || error.message || 'Failed to sign up');
    }
  },

  async googleSignIn(idToken: string) {
    try {
      console.log('Full ID token:', idToken);
      
      const response = await fetch(`${API_BASE_URL}/auth/google-signin`, {
        method: "POST",
        headers: {
          "Content-Type": "text/plain",
          "Accept": "application/json"
        },
        body: idToken,  // Send the raw token
      });

      console.log('Response status:', response.status);
      console.log('Response headers:', Object.fromEntries(response.headers.entries()));
      
      // Check if response is JSON
      const contentType = response.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
        const responseText = await response.text();
        console.error('Received non-JSON response:', responseText);
        throw new Error('Server returned an invalid response. Please try again.');
      }

      const data = await response.json();
      console.log('Response data:', data);

      if (!response.ok) {
        if (data.message === "IdToken is required") {
          console.error('Server did not receive the token properly');
          throw new Error('Failed to send authentication token. Please try again.');
        }
        throw new Error(data.message || `Sign in failed: ${response.status} ${response.statusText}`);
      }

      if (data.accessToken) {
        // Store the token in cookies
        Cookies.set("accessToken", data.accessToken, {
          expires: 15 / (24 * 60), // 15 minutes
          path: "/",
        });
        return data;
      } else {
        throw new Error("No access token received from server");
      }
    } catch (error: any) {
      console.error("Google sign-in error:", error);
      throw new Error(error.message || "Failed to sign in with Google");
    }
  },

  async sendVerificationCode(email: string): Promise<{ success: boolean; message: string }> {
    try {
      const response = await api.patch('/auth/send-verification-code', { email });
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || error.message || 'Failed to send verification code');
    }
  },

  async verifyCode(email: string, providedCode: string): Promise<{ success: boolean; message: string }> {
    try {
      const response = await api.patch('/auth/verify-verification-code', { email, providedCode });
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || error.message || 'Failed to verify code');
    }
  },

  async sendForgotPasswordCode(email: string): Promise<{ success: boolean; message: string }> {
    try {
      const response = await api.post('/auth/send-forgot-password-code', { email });
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || error.message || 'Failed to send reset code');
    }
  },

  async verifyForgotPasswordCode(email: string, providedCode: string): Promise<{ success: boolean; message: string }> {
    try {
      const response = await api.post('/auth/verify-forgot-password-code', { email, providedCode });
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || error.message || 'Failed to verify code');
    }
  },

  async resetPassword(email: string, newPassword: string): Promise<{ success: boolean; message: string }> {
    try {
      const response = await api.patch('/auth/reset-password', { email, newPassword });
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || error.message || 'Failed to reset password');
    }
  },

  logout() {
    document.cookie = 'accessToken=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
    document.cookie = 'Authorization=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
    document.cookie = 'refreshToken=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
    window.location.href = '/auth/login';
  }
}; 
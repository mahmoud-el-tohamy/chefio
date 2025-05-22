import { SignupResponse, SignupRequest, SigninRequest, SigninResponse } from '@/types/auth';
import axios from 'axios';

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

// Add response interceptor to handle token expiration
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      // Clear the token and redirect to login
      document.cookie = 'accessToken=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
      document.cookie = 'Authorization=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
      window.location.href = '/auth/login';
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
    window.location.href = '/auth/login';
  }
}; 
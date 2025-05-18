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

export const authService = {
  async signin(data: SigninRequest): Promise<SigninResponse> {
    try {
      const response = await api.post('/auth/signin', data);
      
      if (response.data.accessToken) {
        // Store the access token in a cookie with 15 minutes expiration
        document.cookie = `accessToken=${response.data.accessToken}; path=/; max-age=900; Secure; SameSite=Strict`;
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
}; 
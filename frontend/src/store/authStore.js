import {create} from "zustand";
import axios from "axios";

const API_URL = 'http://localhost:5000/api/auth'

axios.defaults.withCredentials = true;

export const useAuthStore = create((set) => ({
  user: null,
  isLoading: false,
  error: null,
  isAuthenticated: false,
  isCheckingAuth: true,
  message: null,

  signup: async (name, email, password) => {
    set({ isLoading: true, error: null })
    try {
      const response = await axios.post(`${API_URL}/signup`, { name, email, password })
      set({
        user: response.data.user,
        isAuthenticated: true,
        isLoading: false
      })
    } catch (error) {
      set({ error: error.response.data.message || "Error signing up", isLoading: false })
      throw error;
    }
  },

  login: async (email, password) => {
    set({ isLoading:true, error: null })
    try {
      const response = await axios.post(`${API_URL}/login`, { email, password });

      set({
        isAuthenticated: true,
        isLoading: false,
        user: response.data.user,
      })
    } catch (error) {
      set({ error: error.response.data.message || "Error logging in", isLoading: false})
      throw error;
    }
  },

  logout: async () => {
    set({ isLoading:true, error: null })
    try {
      await axios.post(`${API_URL}/logout`);

      set({
        user: null,
        isAuthenticated: false,
        error: null,
        isLoading: false,
      })
    } catch (error) {
      set({ error: "Error logging out", isLoading: false})
      throw error;
    }
  },

  verifyEmail: async (verificationCode) => {
    set({ isLoading: true, error: null })
    try {
      const response = await axios.post(`${API_URL}/verifyEmail`, { verificationCode })
      set({
        isLoading: false,
        user: response.data.user,
        isAuthenticated: true,
      })
      return response.data;
    } catch (error) {
      set({ error: error.response.data.message || "Error verifying email", isLoading:false })
      throw error;
    }
  },

  checkAuth: async () => {
    set({ isCheckingAuth: true, error: null })
    try {
      const response = await axios.get(`${API_URL}/checkAuth`)
      set({
        isCheckingAuth: false,
        user: response.data.user,
        isAuthenticated: true,
      })
    } catch (error) {
      set({ error: null, isCheckingAuth: false, isAuthenticated: false })
    }
  },

  forgotPassword: async (email) => {
    set({ isLoading: true, error: null })
    try {
      const response = await axios.post(`${API_URL}/forgotPassword`, {email})
      set({
        message: response.data.message,
        isLoading: false,
      })
    } catch (error) {
      set({ error: error.response.data.message || "Error sending reset password email", isLoading: false })
    }
  },

  resetPassword: async (token, newpassword, renewpassword) => {
    set({ isLoading: true, error: null })
    try {
      const response = await axios.post(`${API_URL}/password-reset/${token}`, { newpassword, renewpassword })
      set({
        isLoading: false,
        message: response.data.message,
      })
    } catch (error) {
      set({ error: error.response.data.message || "Error resetting password", isLoading: false })
      throw error;
    }
  },
}));

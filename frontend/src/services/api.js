import axios from 'axios';

// Environment-aware API base URL
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

console.log('API Base URL:', API_BASE_URL); // For debugging in production

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const apiService = {
  // Text analysis
  analyzeText: async (text) => {
    try {
      const response = await api.post('/analyze/text', { text });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.error || 'Text analysis failed');
    }
  },

  // URL analysis
  analyzeUrl: async (url) => {
    try {
      const response = await api.post('/analyze/url', { url });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.error || 'URL analysis failed');
    }
  },

  // File analysis
  analyzeFile: async (file) => {
    try {
      const formData = new FormData();
      formData.append('file', file);
      
      const response = await api.post('/analyze/file', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.error || 'File analysis failed');
    }
  },

  // Get analytics
  getAnalytics: async () => {
    try {
      const response = await api.get('/analytics');
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.error || 'Failed to fetch analytics');
    }
  },

  // Get history
  getHistory: async () => {
    try {
      const response = await api.get('/history');
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.error || 'Failed to fetch history');
    }
  },

  // Clear history
  clearHistory: async () => {
    try {
      const response = await api.delete('/history');
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.error || 'Failed to clear history');
    }
  },
};

export default apiService;

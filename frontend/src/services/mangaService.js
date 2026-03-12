import axios from 'axios';

// Get API base URL from environment variable or use default
const getApiBaseUrl = () => {
  if (import.meta.env.VITE_API_BASE_URL) {
    return import.meta.env.VITE_API_BASE_URL;
  }
  
  // Development fallback
  if (import.meta.env.MODE === 'development') {
    return 'http://localhost:5001';
  }
  
  // Production fallback
  return window.location.origin;
};

const API_BASE_URL = `${getApiBaseUrl()}/api`;

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
});

export const mangaService = {
  // Get random manga
  getRandomManga: async () => {
    try {
      const response = await api.get('/mangadex/random');
      return response.data;
    } catch (error) {
      console.error('Error fetching random manga:', error);
      throw error;
    }
  },

  // Search manga
  searchManga: async (query, limit = 12) => {
    try {
      const response = await api.get('/mangadex/search', {
        params: { query, limit }
      });
      return response.data;
    } catch (error) {
      console.error('Error searching manga:', error);
      throw error;
    }
  },

  // Get manga details
  getMangaDetails: async (mangaId) => {
    try {
      const response = await api.get(`/mangadex/manga/${mangaId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching manga details:', error);
      throw error;
    }
  },

  // Get manga chapters
  getMangaChapters: async (mangaId, limit = 20, offset = 0) => {
    try {
      const response = await api.get(`/mangadex/manga/${mangaId}/chapters`, {
        params: { limit, offset }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching chapters:', error);
      throw error;
    }
  },

  // Get chapter pages
  getChapterPages: async (chapterId) => {
    try {
      const response = await api.get(`/mangadex/chapter/${chapterId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching chapter pages:', error);
      throw error;
    }
  },

  // Get cover image URL
  getCoverImageUrl: (mangaId, coverFilename) => {
    if (!coverFilename) return null;
    return `https://uploads.mangadex.org/covers/${mangaId}/${coverFilename}.256.jpg`;
  }
};

export default api;

import axios from 'axios';

/**
 * Shared Axios instance for all API calls.
 * Base URL is configured via environment variable.
 * All feature services import this instance.
 */
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3001',
  headers: {
    'Content-Type': 'application/json',
  },
});

export default api;

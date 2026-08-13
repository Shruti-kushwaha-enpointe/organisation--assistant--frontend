import axios from 'axios';

// Get the base URL from our environment variables
const baseURL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

// Create a customized instance of axios
const api = axios.create({
  baseURL: `${baseURL}/api/v1`,
  headers: {
    'Content-Type': 'application/json',
  },
});

// We can add interceptors here later if we need to attach auth tokens
// or globally handle errors

export default api;

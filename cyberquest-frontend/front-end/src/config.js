// Central API configuration
// Set VITE_API_URL in your .env file for production, e.g.:
//   VITE_API_URL=https://your-backend.com
// Falls back to local dev server if not set.
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export const ML_API_BASE_URL = import.meta.env.VITE_ML_API_URL || 'http://127.0.0.1:5001';
export default API_BASE_URL;

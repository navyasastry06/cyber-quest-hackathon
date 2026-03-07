// Central API configuration
// Set VITE_API_URL in your .env file for production, e.g.:
//   VITE_API_URL=https://your-backend.com
// Falls back to local dev server if not set.
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export default API_BASE_URL;

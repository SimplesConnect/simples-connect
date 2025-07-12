// API Configuration for different environments
const config = {
  development: {
    API_BASE_URL: 'http://localhost:5000',
  },
  production: {
    API_BASE_URL: 'https://simples-connect.onrender.com', // Use relative URLs in production (handled by render proxy)
  }
};

const environment = process.env.NODE_ENV || 'development';
export const API_CONFIG = config[environment];

// Helper function to get the full API URL
export const getApiUrl = (endpoint) => {
  const baseUrl = API_CONFIG.API_BASE_URL;
  return `${baseUrl}${endpoint}`;
};

export default API_CONFIG; 
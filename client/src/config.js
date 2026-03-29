// API Configuration
// Uses environment variable VITE_API_URL in production
// Falls back to localhost for development
export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

// Helper function to build full API URL
export const getApiUrl = (endpoint) => {
     // Remove leading slash if present to avoid double slashes
     const cleanEndpoint = endpoint.startsWith('/') ? endpoint.slice(1) : endpoint;
     return `${API_BASE_URL}/${cleanEndpoint}`;
};


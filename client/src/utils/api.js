import { API_BASE_URL } from '../config';

/**
 * Helper function to make authenticated API requests
 * Automatically adds JWT token from localStorage
 * @param {string} endpoint - API endpoint (e.g., '/add-case')
 * @param {object} options - Fetch options (method, body, headers, etc.)
 * @returns {Promise} - Response JSON data
 */
export async function apiRequest(endpoint, options = {}) {
    const token = localStorage.getItem('access_token');

    // Build headers
    const headers = {
        'Content-Type': 'application/json',
        ...options.headers,
    };

    // Add Authorization header if token exists
    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }

    // Add user info headers for backend auth middleware fallback and user codes
    const userStr = localStorage.getItem('user');
    if (userStr) {
        try {
            const user = JSON.parse(userStr);
            if (user.role) headers['x-role'] = user.role;
            if (user.id) headers['x-user-code'] = user.id;
        } catch (e) {
            console.error("Error parsing user from localStorage", e);
        }
    }

    try {
        const response = await fetch(`${API_BASE_URL}${endpoint}`, {
            ...options,
            headers,
        });

        // Handle 401 Unauthorized (token expired or invalid)
        if (response.status === 401) {
            console.warn('⚠️ Authentication failed - redirecting to login');
            localStorage.removeItem('access_token');
            localStorage.removeItem('refresh_token');
            localStorage.removeItem('user');
            window.location.href = '/';
            return null;
        }

        // Check content type before parsing
        const contentType = response.headers.get("content-type");
        if (!contentType || !contentType.includes("application/json")) {
            const text = await response.text();
            console.error("Expected JSON but received:", text.substring(0, 100));
            throw new Error(`Server returned non-JSON response: ${response.status}`);
        }

        // Parse response JSON
        const data = await response.json();

        // Check if response indicates an error (non-2xx status or success: false)
        if (!response.ok || (data.success === false)) {
            // Create an error object that includes the response data
            const error = new Error(data.message || `HTTP error! status: ${response.status}`);
            error.status = response.status;
            error.data = data;
            throw error;
        }

        // Return successful response data
        return data;
    } catch (error) {
        console.error('API Request Error:', error);
        throw error;
    }
}

/**
 * Helper function for authenticated GET requests
 */
export async function apiGet(endpoint) {
    return apiRequest(endpoint, { method: 'GET' });
}

/**
 * Helper function for authenticated POST requests
 */
export async function apiPost(endpoint, data) {
    return apiRequest(endpoint, {
        method: 'POST',
        body: JSON.stringify(data),
    });
}

/**
 * Helper function for authenticated PUT requests
 */
export async function apiPut(endpoint, data) {
    return apiRequest(endpoint, {
        method: 'PUT',
        body: JSON.stringify(data),
    });
}

/**
 * Helper function for authenticated DELETE requests
 */
export async function apiDelete(endpoint, data) {
    return apiRequest(endpoint, {
        method: 'DELETE',
        body: JSON.stringify(data),
    });
}

/**
 * Check if user is authenticated (has valid token)
 */
export function isAuthenticated() {
    const token = localStorage.getItem('access_token');
    return !!token;
}

/**
 * Logout user (clear tokens and user data)
 */
export function logout() {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('user');
    window.location.href = '/';
}

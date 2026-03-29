import { API_BASE_URL } from '../config';
import { apiPost } from '../utils/api';

export const authService = {
  async login(email, password, role) {
    const response = await fetch(`${API_BASE_URL}/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password, role }),
    });
    const data = await response.json();
    if (data.success) {
      localStorage.setItem('access_token', data.session.access_token);
      localStorage.setItem('refresh_token', data.session.refresh_token);
      localStorage.setItem('user', JSON.stringify(data.user));
      localStorage.setItem('role', role);
    }
    return data;
  },

  logout() {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('user');
    localStorage.removeItem('role');
    window.location.href = '/';
  },

  async getProfile(email, role) {
    return apiPost('/users/profile', { email, role });
  },

  getCurrentUser() {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  },

  getRole() {
    return localStorage.getItem('role');
  }
};

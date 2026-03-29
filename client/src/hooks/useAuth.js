import { useState, useEffect } from 'react';
import { authService } from '../services/authService';

export const useAuth = () => {
  const [user, setUser] = useState(authService.getCurrentUser());
  const [role, setRole] = useState(authService.getRole());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setUser(authService.getCurrentUser());
    setRole(authService.getRole());
    setLoading(false);
  }, []);

  const login = async (email, password, role) => {
    const result = await authService.login(email, password, role);
    if (result.success) {
      setUser(result.user);
      setRole(role);
    }
    return result;
  };

  const logout = () => {
    authService.logout();
    setUser(null);
    setRole(null);
  };

  return { user, role, loading, login, logout, isAuthenticated: !!user };
};

import React, { createContext, useState, useContext, useEffect } from 'react';
import {
  login as loginApi,
  register as registerApi,
  socialLogin as socialLoginApi,
  verifyToken,
  logout as logoutApi
} from '../services/auth';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const hydrateSession = (session) => {
    setUser(session.user || null);
    return session;
  };

  useEffect(() => {
    const handleUnauthorized = () => setUser(null);

    const checkAuth = async () => {
      try {
        const res = await verifyToken();
        setUser(res.data.user || null);
      } catch {
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    window.addEventListener('auth:unauthorized', handleUnauthorized);
    checkAuth();

    return () => {
      window.removeEventListener('auth:unauthorized', handleUnauthorized);
    };
  }, []);

  const login = async (email, password) => {
    const res = await loginApi(email, password);
    return hydrateSession(res.data);
  };

  const register = async (nombre, email, password) => {
    const res = await registerApi(nombre, email, password);
    return hydrateSession(res.data);
  };

  const socialLogin = async (provider, email, nombre) => {
    const res = await socialLoginApi(provider, email, nombre);
    return hydrateSession(res.data);
  };

  const logout = async () => {
    try {
      await logoutApi();
    } finally {
      setUser(null);
    }
  };

  const isAdmin = user?.role === 'admin';

  return (
    <AuthContext.Provider value={{ user, isAdmin, loading, login, register, socialLogin, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

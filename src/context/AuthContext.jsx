import { useState, useEffect, useCallback } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { AuthContext } from './useAuth';

const USER_KEY  = 'pm_user';

const readStoredUser = () => {
  const storedUser = localStorage.getItem(USER_KEY);
  if (!storedUser) return null;

  try {
    return JSON.parse(storedUser);
  } catch {
    localStorage.removeItem(USER_KEY);
    return null;
  }
};

export function AuthProvider({ children }) {
  const queryClient = useQueryClient();
  // Os dados locais restauram a interface; a API continua validando a sessão.
  const [user, setUser] = useState(readStoredUser);
  const [isLoggedIn, setIsLoggedIn] = useState(() => Boolean(localStorage.getItem(USER_KEY)));
  const [hasResume, setHasResume]   = useState(false);

  const [isAuthModalOpen, setAuthModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState('login');

  const openAuthModal = (mode = 'login') => {
    setAuthModalMode(mode);
    setAuthModalOpen(true);
  };

  const closeAuthModal = () => {
    setAuthModalOpen(false);
  };

  const login = (userData) => {
    // Evita que outra conta veja dados do cache da sessão anterior.
    queryClient.clear();
    localStorage.setItem(USER_KEY, JSON.stringify(userData));
    setHasResume(false);
    setIsLoggedIn(true);
    setUser(userData);
  };

  const logout = useCallback(async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST', credentials: 'include' });
    } catch {
      // mesmo se falhar, limpa o estado local
    }
    queryClient.clear();
    localStorage.removeItem(USER_KEY);
    setIsLoggedIn(false);
    setUser(null);
    setHasResume(false);
  }, [queryClient]);

  useEffect(() => {
    const handleUnauthorized = () => {
      logout();
    };
    window.addEventListener('auth:unauthorized', handleUnauthorized);
    return () => window.removeEventListener('auth:unauthorized', handleUnauthorized);
  }, [logout]);

  const updateUserField = (field, value) => {
    const updated = { ...user, [field]: value };
    setUser(prev => ({ ...prev, [field]: value }));
    try {
      localStorage.setItem(USER_KEY, JSON.stringify(updated));
      return true;
    } catch {
      // A foto já foi salva no servidor; uma falha de armazenamento não desfaz o preview.
      return false;
    }
  };

  return (
    <AuthContext.Provider value={{ 
      isLoggedIn, user, hasResume, setHasResume, login, logout, updateUserField,
      isAuthModalOpen, authModalMode, openAuthModal, closeAuthModal, setAuthModalMode
    }}>
      {children}
    </AuthContext.Provider>
  );
}

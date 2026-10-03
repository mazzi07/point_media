import React, { useState, useEffect, useCallback } from 'react';
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
  // restaura o usuário antes de verificar se há uma sessão salva válida
  const [user, setUser] = useState(readStoredUser);
  const [isLoggedIn, setIsLoggedIn] = useState(() => Boolean(localStorage.getItem(USER_KEY)));
  const [hasResume, setHasResume]   = useState(false);

  // controle do modal de login/cadastro
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
    queryClient.clear();
    localStorage.setItem(USER_KEY, JSON.stringify(userData));
    setHasResume(false);
    setIsLoggedIn(true);
    setUser(userData);
  };

  const logout = useCallback(async () => {
    // avisa o servidor pra apagar o cookie
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

  // se receber evento de 401 do api.js, desloga
  useEffect(() => {
    const handleUnauthorized = () => {
      logout();
    };
    window.addEventListener('auth:unauthorized', handleUnauthorized);
    return () => window.removeEventListener('auth:unauthorized', handleUnauthorized);
  }, [logout]);

  const updateUserField = (field, value) => {
    setUser(prev => {
      const updated = { ...prev, [field]: value };
      localStorage.setItem(USER_KEY, JSON.stringify(updated));
      return updated;
    });
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

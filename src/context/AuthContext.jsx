import React, { createContext, useState, useContext, useEffect } from 'react';

const AuthContext = createContext();

const USER_KEY  = 'pm_user';

export function AuthProvider({ children }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser]             = useState(null);
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

  // ao abrir o site, verifica se tem login salvo
  useEffect(() => {
    const storedUser  = localStorage.getItem(USER_KEY);

    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
        setIsLoggedIn(true);
      } catch {
        localStorage.removeItem(USER_KEY);
      }
    }
  }, []);

  // se receber evento de 401 do api.js, desloga
  useEffect(() => {
    const handleUnauthorized = () => {
      logout();
    };
    window.addEventListener('auth:unauthorized', handleUnauthorized);
    return () => window.removeEventListener('auth:unauthorized', handleUnauthorized);
  }, []);

  const login = (userData) => {
    localStorage.setItem(USER_KEY, JSON.stringify(userData));
    setIsLoggedIn(true);
    setUser(userData);
  };

  const logout = async () => {
    // avisa o servidor pra apagar o cookie
    try {
      await fetch('/api/auth/logout', { method: 'POST', credentials: 'include' });
    } catch {
      // mesmo se falhar, limpa o estado local
    }
    localStorage.removeItem(USER_KEY);
    setIsLoggedIn(false);
    setUser(null);
    setHasResume(false);
  };

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

export const useAuth = () => useContext(AuthContext);

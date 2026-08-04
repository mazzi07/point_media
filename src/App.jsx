import React from 'react'
import { Box } from '@chakra-ui/react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

const queryClient = new QueryClient();

import Navbar from './components/Navbar'
import Footer from './components/Footer'
import Home from './pages/Home'
import Sobre from './pages/Sobre'
import Vagas from './pages/Vagas'
import CriarPerfil from './pages/CriarPerfil'
import AdminPage from './pages/AdminPage'
import Quizzes from './pages/Quizzes'
import QuizTest from './pages/QuizTest'
import { AuthProvider, useAuth } from './context/AuthContext'
import AuthModal from './components/AuthModal'

// rota que exige login de candidato
const PrivateRoute = ({ children }) => {
  const { isLoggedIn, user } = useAuth();
  if (!isLoggedIn) return <Navigate to="/" replace />;
  if (user?.tipo === 'ADMIN') return <Navigate to="/admin" replace />;
  return children;
};

// rota exclusiva pra admin
const AdminRoute = ({ children }) => {
  const { isLoggedIn, user } = useAuth();
  if (!isLoggedIn) return <Navigate to="/" replace />;
  if (user?.tipo !== 'ADMIN') return <Navigate to="/" replace />;
  return children;
};

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <AuthProvider>
        <Box display="flex" flexDirection="column" minHeight="100vh">
          <Navbar />
          <Box flex="1">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/sobre"     element={<Sobre />} />
              <Route path="/vagas"     element={<Vagas />} />
              <Route path="/quizzes" element={<Quizzes />} />
              <Route path="/quizzes/:id" element={<QuizTest />} />
              <Route path="/criar-perfil" element={
                <PrivateRoute><CriarPerfil /></PrivateRoute>
              } />
              <Route path="/admin" element={
                <AdminRoute><AdminPage /></AdminRoute>
              } />
            </Routes>
            <AuthModal />
          </Box>
          <Footer />
        </Box>
      </AuthProvider>
    </BrowserRouter>
  </QueryClientProvider>
  )
}

export default App

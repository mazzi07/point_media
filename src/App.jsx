import { Box, Heading, Text, Button } from '@chakra-ui/react'
import { BrowserRouter, Routes, Route, Navigate, Link as RouterLink } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

const queryClient = new QueryClient();

import Navbar from './components/Navbar'
import Footer from './components/Footer'
import Home from './pages/Home'
import Sobre from './pages/Sobre'
import Vagas from './pages/Vagas'
import AdminPage from './pages/AdminPage'
import ResumeWizard from './components/ResumeWizard'
import Quizzes from './pages/Quizzes'
import QuizTest from './pages/QuizTest'
import Perfil from './pages/Perfil'
import { AuthProvider } from './context/AuthContext'
import { useAuth } from './context/useAuth'
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
          <Box as="main" flex="1" minW={0}>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/sobre"     element={<Sobre />} />
              <Route path="/vagas"     element={<Vagas />} />
              <Route path="/quizzes" element={<Quizzes />} />
              <Route path="/quizzes/:id" element={<PrivateRoute><QuizTest /></PrivateRoute>} />
              <Route path="/criar-perfil" element={
                <PrivateRoute><ResumeWizard /></PrivateRoute>
              } />
              <Route path="/perfil" element={
                <PrivateRoute><Perfil /></PrivateRoute>
              } />
              <Route path="/admin" element={
                <AdminRoute><AdminPage /></AdminRoute>
              } />
              <Route path="*" element={
                <Box textAlign="center" py={16} px={4}>
                  <Heading as="h1" size="lg" mb={4}>Página não encontrada</Heading>
                  <Text mb={6}>O endereço informado não existe.</Text>
                  <Button as={RouterLink} to="/" variant="gradient">Voltar ao início</Button>
                </Box>
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

import React, { useState, useEffect, useRef } from 'react';
import {
  Box, Flex, Button, useColorModeValue, useColorMode, HStack, Link,
  IconButton, Image, Menu, MenuButton, MenuList, MenuItem, Avatar, Text,
  Popover, PopoverTrigger, PopoverContent, PopoverBody, VStack, Badge,
  Icon, Divider, useToast
} from '@chakra-ui/react';
import { Link as RouterLink, useNavigate, useLocation } from 'react-router-dom';
import { FaBell, FaCircle, FaSun, FaMoon } from 'react-icons/fa';
import pointLogo from '../assets/point.png';
import { useAuth } from '../context/useAuth';
import { api } from '../services/api';
import { AVATAR_ACCEPT, validateAvatarFile } from '../utils/avatar';

export default function Navbar() {
  const { colorMode, toggleColorMode } = useColorMode();
  const navigate = useNavigate();
  const location = useLocation();
  const toast = useToast();
  const fileInputRef = useRef(null);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const { isLoggedIn, logout, user, openAuthModal, updateUserField } = useAuth();

  const bg          = useColorModeValue('rgba(255, 255, 255, 0.85)', 'rgba(11, 15, 25, 0.85)');
  const borderColor = useColorModeValue('transparent', 'whiteAlpha.100');
  const navShadow   = useColorModeValue('0 4px 30px rgba(0, 0, 0, 0.03)', 'none');
  const textMuted   = useColorModeValue('gray.500', 'gray.400');
  const activeColor = useColorModeValue('brand.pink', 'brand.pink');
  const textStrong  = useColorModeValue('#1B254B', 'white');
  const hoverBg     = useColorModeValue('gray.50', 'whiteAlpha.200');
  const cardBg      = useColorModeValue('white', 'brand.cardBg');
  const notifUnread = useColorModeValue('blue.50', 'whiteAlpha.100');
  const notifHover  = useColorModeValue('gray.50', 'whiteAlpha.200');


  const resumeBtnBg = useColorModeValue('blue.50', 'whiteAlpha.100');
  const resumeBtnColor = useColorModeValue('brand.blue', 'white');
  const resumeBtnHover = useColorModeValue('blue.100', 'whiteAlpha.200');
  const resumeBtnBorder = useColorModeValue('blue.100', 'whiteAlpha.200');

  // notificacoes do usuario
  const userEmail = isLoggedIn ? user?.email : null;
  const [notificationState, setNotificationState] = useState(() => ({
    userEmail, notificacoes: [], naoLidas: 0
  }));
  const notificationScope = useRef(null);

  // Limpa antes de renderizar os dados de uma conta diferente.
  if (notificationState.userEmail !== userEmail) {
    setNotificationState({ userEmail, notificacoes: [], naoLidas: 0 });
  }
  const notificacoes = notificationState.userEmail === userEmail ? notificationState.notificacoes : [];
  const naoLidas = notificationState.userEmail === userEmail ? notificationState.naoLidas : 0;

  // busca notificacoes ao logar e atualiza a cada 30s
  useEffect(() => {
    if (!isLoggedIn || !userEmail) return;
    const scope = { active: true };
    notificationScope.current = scope;
    const fetchNotificacoes = () => {
      api.get('/api/notificacoes')
        .then(async (res) => {
          if (res.ok) {
            const data = await res.json();
            if (scope.active) {
              setNotificationState({
                userEmail, notificacoes: data, naoLidas: data.filter((n) => !n.lida).length
              });
            }
          }
        })
        .catch(() => {});
    };
    fetchNotificacoes();
    const interval = setInterval(fetchNotificacoes, 30000);
    return () => {
      scope.active = false;
      clearInterval(interval);
    };
  }, [isLoggedIn, userEmail]);

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    e.target.value = '';
    if (!file) return;

    const error = validateAvatarFile(file);
    if (error) {
      toast({ title: error, status: 'warning' });
      return;
    }

    setUploadingAvatar(true);
    const reader = new FileReader();
    reader.onload = async (event) => {
      const base64 = event.target.result;
      try {
        const response = await api.post('/api/usuarios/avatar', { avatar: base64 });
        if (response.ok) {
          const stored = updateUserField('avatar', base64);
          toast({ title: 'Foto de perfil atualizada!', status: stored ? 'success' : 'warning',
            description: stored ? undefined : 'Foto salva no servidor, mas não foi possível atualizar o armazenamento deste navegador.' });
        } else {
          toast({ title: 'Erro ao atualizar foto.', status: 'error' });
        }
      } catch {
        toast({ title: 'Erro de conexão.', status: 'error' });
      } finally {
        setUploadingAvatar(false);
      }
    };
    const handleReadError = () => {
      setUploadingAvatar(false);
      toast({ title: 'Não foi possível ler a imagem. Tente novamente.', status: 'error' });
    };
    reader.onerror = handleReadError;
    reader.onabort = handleReadError;
    try {
      reader.readAsDataURL(file);
    } catch {
      handleReadError();
    }
  };

  const marcarLida = async (id) => {
    const scope = notificationScope.current;
    if (!scope?.active) return;
    await api.put(`/api/notificacoes/${id}/ler`);
    if (!scope.active) return;
    setNotificationState((prev) => ({
      ...prev,
      notificacoes: prev.notificacoes.map((n) => (n.id === id ? { ...n, lida: true } : n)),
      naoLidas: Math.max(0, prev.naoLidas - 1)
    }));
  };

  const navLinks = [
    { label: 'Início', to: '/' },
    { label: 'Sobre', to: '/sobre' },
    { label: 'Vagas', to: '/vagas' },
    { label: 'Quizzes', to: '/quizzes' },
  ];

  return (
    <Box bg={bg} px={8} borderBottom="1px solid" borderColor={borderColor} boxShadow={navShadow}
      backdropFilter="blur(12px)" position="sticky" top={0} zIndex={100} w="100%" transition="all 0.3s">
      <Flex h={16} alignItems="center" justifyContent="space-between" maxW="7xl" mx="auto">


        <HStack spacing={12} alignItems="center">
          <HStack spacing={3} cursor="pointer" onClick={() => navigate('/')}>
            <Image src={pointLogo} alt="Point Media Logo" w="28px" h="28px" objectFit="contain" />
            <Text fontWeight="700" fontSize="md" color={textStrong}
              display={{ base: 'none', md: 'block' }}>
              Point Media
            </Text>
          </HStack>
          
          <HStack as="nav" spacing={6} display={{ base: 'none', md: 'flex' }}>
            {navLinks.map((item) => {
              const isActive = location.pathname === item.to;
              return (
                <Link as={RouterLink} to={item.to} key={item.label}
                  fontSize="sm" fontWeight={isActive ? "600" : "500"} 
                  color={isActive ? textStrong : textMuted}
                  position="relative"
                  _hover={{ textDecoration: 'none', color: textStrong }}
                  transition="all 0.2s">
                  {item.label}
                  {isActive && (
                    <Box position="absolute" bottom="-18px" left="0" w="100%" h="2px" bg={activeColor} />
                  )}
                </Link>
              )
            })}
          </HStack>
        </HStack>


        <HStack spacing={4}>
          <IconButton aria-label="Alternar tema"
            icon={colorMode === 'light' ? <FaMoon size={14} /> : <FaSun size={14} color="#FBBF24" />}
            onClick={toggleColorMode} variant="ghost" size="sm" isRound 
            _hover={{ bg: hoverBg }} />

          {!isLoggedIn ? (
            <>
              <Button variant="ghost" color={activeColor} fontSize="sm" fontWeight="500" 
                onClick={() => openAuthModal('login')}>
                Entrar
              </Button>
              <Button onClick={() => openAuthModal('register')} size="sm" variant="gradient" px={6} py={4}>
                Cadastrar
              </Button>
            </>
          ) : (
            <>
              {/* notificacoes */}
              <Popover placement="bottom-end">
                <PopoverTrigger>
                  <Box position="relative" cursor="pointer">
                    <IconButton
                      aria-label="Notificações"
                      icon={<Icon as={FaBell} />}
                      variant="ghost"
                      size="sm"
                    />
                    {naoLidas > 0 && (
                      <Badge
                        position="absolute" top="2px" right="2px"
                        bg="brand.pink" color="white" borderRadius="full"
                        fontSize="9px" px={1} minW="16px" textAlign="center"
                        lineHeight="16px"
                      >
                        {naoLidas > 9 ? '9+' : naoLidas}
                      </Badge>
                    )}
                  </Box>
                </PopoverTrigger>
                <PopoverContent w="320px" shadow="lg" border="1px solid"
                  borderColor={borderColor}
                  bg={bg}>
                  <PopoverBody p={0}>
                    <Box px={4} py={3} borderBottom="1px solid" borderColor={borderColor}>
                      <Text fontSize="sm" fontWeight="600"
                        color={textStrong}>
                        Notificações
                      </Text>
                    </Box>
                    <VStack spacing={0} align="stretch" maxH="320px" overflowY="auto">
                      {notificacoes.length === 0 ? (
                        <Box px={4} py={6} textAlign="center">
                          <Text fontSize="sm" color={textMuted}>Nenhuma notificação.</Text>
                        </Box>
                      ) : (
                        notificacoes.slice(0, 10).map((n, idx) => (
                          <Box key={n.id}>
                            <Box
                              px={4} py={3} cursor={!n.lida ? 'pointer' : 'default'}
                              bg={!n.lida ? notifUnread : 'transparent'}
                              _hover={{ bg: notifHover }}
                              onClick={() => !n.lida && marcarLida(n.id)}
                            >
                              <HStack spacing={2} align="flex-start">
                                {!n.lida && (
                                  <Icon as={FaCircle} color="brand.blue" w={2} h={2} mt={1.5} flexShrink={0} />
                                )}
                                <Box flex={1}>
                                  <Text fontSize="sm" fontWeight={n.lida ? '400' : '600'}
                                    color={textStrong}>
                                    {n.titulo}
                                  </Text>
                                  <Text fontSize="xs" color={textMuted} mt={0.5}>{n.mensagem}</Text>
                                </Box>
                              </HStack>
                            </Box>
                            {idx < notificacoes.length - 1 && (
                              <Divider borderColor={borderColor} />
                            )}
                          </Box>
                        ))
                      )}
                    </VStack>
                  </PopoverBody>
                </PopoverContent>
              </Popover>


              {user?.tipo !== 'ADMIN' && (
                <Button as={RouterLink} to="/criar-perfil" size="sm"
                  bg={resumeBtnBg}
                  color={resumeBtnColor}
                  fontWeight="600"
                  border="1px solid" borderColor={resumeBtnBorder}
                  _hover={{ bg: resumeBtnHover, transform: 'translateY(-1px)' }}
                  display={{ base: 'none', md: 'flex' }}
                  borderRadius="full"
                  px={6}>
                  Meu Currículo
                </Button>
              )}

              {/* menu do usuario */}
              <input type="file" accept={AVATAR_ACCEPT} disabled={uploadingAvatar} ref={fileInputRef} style={{ display: 'none' }} onChange={handleAvatarChange} />
              <Menu>
                <MenuButton>
                  <Avatar size="sm" src={user?.avatar} name={user?.nome || 'Usuário'} bg="brand.blue"
                    color="white" cursor="pointer" />
                </MenuButton>
                <MenuList fontSize="sm" bg={cardBg} borderColor={borderColor}>
                  <MenuItem bg={cardBg} _hover={{ bg: hoverBg }} onClick={() => fileInputRef.current.click()}>Alterar Foto de Perfil</MenuItem>
                  {user?.tipo !== 'ADMIN' && (
                    <>
                      <MenuItem bg={cardBg} _hover={{ bg: hoverBg }} onClick={() => navigate('/perfil')}>Meu Perfil</MenuItem>
                      <MenuItem bg={cardBg} _hover={{ bg: hoverBg }} onClick={() => navigate('/criar-perfil')}>Meu Currículo</MenuItem>
                    </>
                  )}
                  {user?.tipo === 'ADMIN' && (
                    <MenuItem bg={cardBg} _hover={{ bg: hoverBg }} onClick={() => navigate('/admin')}>Painel Admin</MenuItem>
                  )}
                  <MenuItem bg={cardBg} _hover={{ bg: hoverBg }} onClick={logout}>Sair</MenuItem>
                </MenuList>
              </Menu>
            </>
          )}
        </HStack>
      </Flex>
    </Box>
  );
}

import { useState, useEffect, useRef } from 'react';
import {
  Box, Flex, Button, useColorMode, HStack, Link,
  IconButton, Image, Menu, MenuButton, MenuList, MenuItem, Avatar, Text,
  Popover, PopoverTrigger, PopoverContent, PopoverBody, VStack, Badge,
  Icon, Divider, useToast, Container
} from '@chakra-ui/react';
import { Link as RouterLink, useNavigate, useLocation } from 'react-router-dom';
import { FaBell, FaCircle, FaSun, FaMoon, FaBars } from 'react-icons/fa';
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

  const bg = 'surface';
  const borderColor = 'border';
  const textMuted = 'textSecondary';
  const activeColor = 'brandPink';
  const textStrong = 'textPrimary';
  const hoverBg = 'hover';
  const cardBg = 'elevated';
  const notifUnread = 'active';
  const notifHover = 'hover';

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
    const scope = { active: true, reading: new Set(), readIds: new Set() };
    notificationScope.current = scope;
    const fetchNotificacoes = () => {
      api.get('/api/notificacoes')
        .then(async (res) => {
          if (res.ok) {
            const data = await res.json();
            if (scope.active) {
              const current = data.map(n => scope.readIds.has(n.id) ? { ...n, lida: true } : n);
              setNotificationState({
                userEmail, notificacoes: current, naoLidas: current.filter((n) => !n.lida).length
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
    if (!scope?.active || scope.reading.has(id) || scope.readIds.has(id)) return;
    scope.reading.add(id);
    try {
      const res = await api.put(`/api/notificacoes/${id}/ler`);
      if (!scope.active) return;
      if (!res.ok) throw new Error('Falha ao marcar notificação');
      scope.readIds.add(id);
      setNotificationState((prev) => {
        if (prev.userEmail !== userEmail) return prev;
        const updated = prev.notificacoes.map(n => n.id === id ? { ...n, lida: true } : n);
        return { ...prev, notificacoes: updated, naoLidas: updated.filter(n => !n.lida).length };
      });
    } catch {
      if (scope.active) toast({ title: 'Não foi possível marcar a notificação como lida.', status: 'error' });
    } finally {
      scope.reading.delete(id);
    }
  };

  const navLinks = [
    { label: 'Início', to: '/' },
    { label: 'Sobre', to: '/sobre' },
    { label: 'Vagas', to: '/vagas' },
    { label: 'Quizzes', to: '/quizzes' },
  ];

  return (
    <Box as="header" bg={bg} borderBottom="1px solid" borderColor={borderColor}
      position="sticky" top={0} zIndex={100} w="100%">
      <Container>
      <Flex minH={16} gap={3} alignItems="center" justifyContent="space-between">


        <HStack spacing={{ base: 3, lg: 10 }} alignItems="center" minW={0}>
          <HStack as={RouterLink} to="/" aria-label="Point Media — início" spacing={2} flexShrink={0}>
            <Image src={pointLogo} alt="Point Media Logo" w="28px" h="28px" objectFit="contain" />
            <Text fontWeight="700" fontSize="md" color={textStrong}
              display={{ base: 'none', sm: 'block' }}>
              Point Media
            </Text>
          </HStack>

          <HStack as="nav" aria-label="Navegação principal" spacing={6} display={{ base: 'none', lg: 'flex' }}>
            {navLinks.map((item) => {
              const isActive = location.pathname === item.to;
              return (
                <Link as={RouterLink} to={item.to} key={item.label}
                  aria-current={isActive ? 'page' : undefined}
                  py={5} fontSize="sm" fontWeight={isActive ? "600" : "500"}
                  color={isActive ? textStrong : textMuted}
                  position="relative"
                  _hover={{ textDecoration: 'none', color: textStrong }}
                  transition="color 180ms">
                  {item.label}
                  {isActive && (
                    <Box position="absolute" bottom="0" left="0" w="100%" h="2px" bg={activeColor} />
                  )}
                </Link>
              )
            })}
          </HStack>
        </HStack>


        <HStack spacing={{ base: 1, md: 4 }}>
          <Box display={{ base: 'block', lg: 'none' }}>
            <Menu placement="bottom-end">
              <MenuButton as={IconButton} aria-label="Abrir navegação" icon={<FaBars />} size="sm" variant="ghost" />
              <MenuList bg={cardBg} borderColor={borderColor}>
                {navLinks.map(item => (
                  <MenuItem as={RouterLink} to={item.to} key={item.to} bg={cardBg}
                    aria-current={location.pathname === item.to ? 'page' : undefined}>
                    {item.label}
                  </MenuItem>
                ))}
              </MenuList>
            </Menu>
          </Box>
          <IconButton aria-label="Alternar tema"
            icon={colorMode === 'light' ? <FaMoon size={14} /> : <FaSun size={14} />}
            onClick={toggleColorMode} variant="ghost" size="sm"
            _hover={{ bg: hoverBg }} />

          {!isLoggedIn ? (
            <>
              <Button variant="ghost" color={textStrong} fontSize="sm" fontWeight="500"
                onClick={() => openAuthModal('login')}>
                Entrar
              </Button>
              <Button onClick={() => openAuthModal('register')} size="sm" variant="primary" px={{ base: 3, md: 4 }}>
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
                <PopoverContent w="320px" maxW="calc(100vw - 24px)" shadow="lg" border="1px solid"
                  borderColor={borderColor}
                  bg="elevated">
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
                        notificacoes.map((n, idx) => (
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
                  variant="secondary"
                  display={{ base: 'none', lg: 'flex' }} px={4}>
                  Meu Currículo
                </Button>
              )}

              {user?.tipo === 'ADMIN' && (
                <Button as={RouterLink} to="/admin" size="sm" variant="secondary"
                  aria-current={location.pathname === '/admin' ? 'page' : undefined}>
                  Admin
                </Button>
              )}

              {/* menu do usuario */}
              <input type="file" accept={AVATAR_ACCEPT} disabled={uploadingAvatar} ref={fileInputRef} style={{ display: 'none' }} onChange={handleAvatarChange} />
              <Menu placement="bottom-end">
                <MenuButton aria-label="Menu da conta" borderRadius="control" p={1}>
                  <Avatar size="sm" src={user?.avatar} name={user?.nome || 'Usuário'} bg="brand.blue"
                    color="white" cursor="pointer" />
                </MenuButton>
                <MenuList fontSize="sm" bg={cardBg} borderColor={borderColor}>
                  <Box px={3} py={2} borderBottom="1px solid" borderColor={borderColor} mb={1}>
                    <Text fontWeight="600" noOfLines={1} maxW="220px">{user?.nome || 'Usuário'}</Text>
                    <Text fontSize="xs" color="textSecondary">{user?.tipo === 'ADMIN' ? 'Administração' : 'Candidato'}</Text>
                  </Box>
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
      </Container>
    </Box>
  );
}

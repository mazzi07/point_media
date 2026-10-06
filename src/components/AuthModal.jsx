import React, { useState } from 'react';
import {
  Modal, ModalOverlay, ModalContent, ModalBody, ModalCloseButton,
  Box, Flex, VStack, Heading, Text, Input, Button, Link,
  InputGroup, InputLeftElement, InputRightElement, Icon, Checkbox, HStack,
  useToast, Divider, FormControl, FormErrorMessage, Image,
  IconButton
} from '@chakra-ui/react';
import pointLogo from '../assets/point.png';
import { FaEnvelope, FaLock, FaUser, FaBriefcase, FaStar, FaMagic, FaCheckCircle, FaChartLine, FaEye, FaEyeSlash } from 'react-icons/fa';
import { useAuth } from '../context/useAuth';
import { api } from '../services/api';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

const loginSchema = z.object({
  email: z.string({ error: 'O e-mail é obrigatório' }).min(1, 'O e-mail é obrigatório').email('Formato de e-mail inválido'),
  senha: z.string({ error: 'A senha é obrigatória' }).min(1, 'A senha é obrigatória'),
  lembrar_me: z.boolean().optional(),
});

const registerSchema = z.object({
  nome: z.string({ error: 'O nome é obrigatório' }).min(3, 'O nome deve ter no mínimo 3 caracteres'),
  email: z.string({ error: 'O e-mail é obrigatório' }).min(1, 'O e-mail é obrigatório').email('Formato de e-mail inválido'),

  senha: z.string({ error: 'A senha é obrigatória' }).min(6, 'A senha deve ter no mínimo 6 caracteres'),
  confirmarSenha: z.string({ error: 'Confirme sua senha' }).min(1, 'Confirme sua senha'),
}).refine((data) => data.senha === data.confirmarSenha, {
  message: "As senhas não coincidem",
  path: ["confirmarSenha"],
});

export default function AuthModal() {
  const { isAuthModalOpen, closeAuthModal, authModalMode, setAuthModalMode, login } = useAuth();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const toast = useToast();
  const navigate = useNavigate();

  const isLogin = authModalMode === 'login';

  const {
    register: registerLogin,
    handleSubmit: handleSubmitLogin,
    formState: { errors: errorsLogin },
    reset: resetLogin
  } = useForm({
    resolver: zodResolver(loginSchema),
  });

  const {
    register: registerSignup,
    handleSubmit: handleSubmitSignup,
    formState: { errors: errorsSignup },
    reset: resetSignup
  } = useForm({
    resolver: zodResolver(registerSchema),
  });

  const onLoginSubmit = async (data) => {
    setLoading(true);
    try {
      const response = await api.post('/api/auth/login', data);
      const resData = await response.json();
      if (response.ok && resData.success) {
        login(resData.usuario);
        toast({ title: 'Login realizado!', status: 'success', duration: 3000, position: 'top' });
        closeAuthModal();
        if (resData.usuario.tipo === 'ADMIN') {
          navigate('/admin');
        } else {
          navigate('/');
        }
      } else {
        toast({ title: 'Credenciais inválidas', description: resData.message, status: 'error', duration: 4000, position: 'top' });
      }
    } catch {
      toast({ title: 'Erro de conexão', status: 'error', duration: 4000, position: 'top' });
    } finally {
      setLoading(false);
    }
  };

  const onRegisterSubmit = async (data) => {
    setLoading(true);
    try {
      const payload = {
        nome: data.nome,
        email: data.email,
        senha: data.senha
      };
      const response = await api.post('/api/auth/register', payload);
      const resData = await response.json();
      if (response.ok && resData.success) {
        login(resData.usuario);
        toast({ title: 'Conta criada!', status: 'success', duration: 3000, position: 'top' });
        closeAuthModal();
        navigate('/criar-perfil');
      } else {
        toast({ title: 'Erro no cadastro', description: resData.message, status: 'error', duration: 4000, position: 'top' });
      }
    } catch {
      toast({ title: 'Erro de conexão', status: 'error', duration: 4000, position: 'top' });
    } finally {
      setLoading(false);
    }
  };

  const switchMode = () => {
    resetLogin();
    resetSignup();
    setAuthModalMode(isLogin ? 'register' : 'login');
  };

  return (
    <Modal isOpen={isAuthModalOpen} onClose={closeAuthModal} isCentered size="4xl">
      <ModalOverlay backdropFilter="blur(4px)" />
      <ModalContent overflow="hidden" borderRadius="2xl" bg="transparent" border="none" boxShadow="2xl" mx={4}>
        <ModalCloseButton color="gray.400" zIndex={10} top={4} right={4} _hover={{ color: 'white' }} />
        <Flex direction={{ base: 'column', md: 'row' }} minH={{ base: 'auto', md: '600px' }}>
          
          {/* lado decorativo - escondido no mobile */}
          <Box flex={{ base: 'none', md: '4' }} p={10} color="white" position="relative"
            bg="brand.darkBg" overflow="hidden" display={{ base: 'none', md: 'block' }}
            borderRight="1px solid" borderColor="whiteAlpha.50">
            <Box position="absolute" top="-20%" left="-20%" w="70%" h="70%" bgGradient="radial(circle, rgba(213,24,123,0.12) 0%, transparent 70%)" filter="blur(40px)" borderRadius="full" pointerEvents="none" />
            <Box position="absolute" bottom="-20%" right="-20%" w="70%" h="70%" bgGradient="radial(circle, rgba(59,130,246,0.12) 0%, transparent 70%)" filter="blur(40px)" borderRadius="full" pointerEvents="none" />
            
            <Flex direction="column" h="full" position="relative" zIndex={1}>
              <HStack spacing={3} mb={16}>
                <Image src={pointLogo} alt="Point Media Logo" w="32px" h="32px" objectFit="contain" />
                <Text fontSize="xl" fontWeight="700" letterSpacing="tight">Point Media</Text>
              </HStack>

              <VStack align="stretch" spacing={10} mt={4}>
                {isLogin ? (
                  <>
                    <HStack align="flex-start" spacing={4}>
                      <Flex w={10} h={10} borderRadius="10px" bg="whiteAlpha.200" align="center" justify="center" flexShrink={0}>
                        <Icon as={FaStar} color="white" />
                      </Flex>
                      <Box>
                        <Heading size="md" mb={1}>Oportunidades Exclusivas</Heading>
                        <Text fontSize="sm" color="whiteAlpha.800">Acesse vagas de empresas parceiras</Text>
                      </Box>
                    </HStack>
                    <HStack align="flex-start" spacing={4}>
                      <Flex w={10} h={10} borderRadius="10px" bg="whiteAlpha.200" align="center" justify="center" flexShrink={0}>
                        <Icon as={FaMagic} color="white" />
                      </Flex>
                      <Box>
                        <Heading size="md" mb={1}>Destaque seu Talento</Heading>
                        <Text fontSize="sm" color="whiteAlpha.800">Valide suas competências profissionais</Text>
                      </Box>
                    </HStack>
                  </>
                ) : (
                  <>
                    <HStack align="flex-start" spacing={4}>
                      <Flex w={10} h={10} borderRadius="10px" bg="whiteAlpha.200" align="center" justify="center" flexShrink={0}>
                        <Icon as={FaCheckCircle} color="white" />
                      </Flex>
                      <Box>
                        <Heading size="md" mb={1}>Cadastro Rápido</Heading>
                        <Text fontSize="sm" color="whiteAlpha.800">Crie sua conta em poucos minutos</Text>
                      </Box>
                    </HStack>
                    <HStack align="flex-start" spacing={4}>
                      <Flex w={10} h={10} borderRadius="10px" bg="whiteAlpha.200" align="center" justify="center" flexShrink={0}>
                        <Icon as={FaChartLine} color="white" />
                      </Flex>
                      <Box>
                        <Heading size="md" mb={1}>Cresça Profissionalmente</Heading>
                        <Text fontSize="sm" color="whiteAlpha.800">Acesse oportunidades exclusivas</Text>
                      </Box>
                    </HStack>
                  </>
                )}
              </VStack>

              <Text fontSize="xs" color="whiteAlpha.700" mt="auto">
                {isLogin ? "Conectando talentos às melhores oportunidades desde 2017" : "Junte-se a milhares de profissionais que confiam na Point Media"}
              </Text>
            </Flex>
          </Box>

          {/* formulario */}
          <Box flex={{ base: 'none', md: '6' }} bg="brand.cardBg" p={{ base: 6, md: 10 }} position="relative">
            <ModalBody p={0} display="flex" flexDirection="column" h="full" justifyContent="center">
              {/* logo so aparece no mobile */}
              <HStack spacing={3} mb={8} display={{ base: 'flex', md: 'none' }}>
                <Image src={pointLogo} alt="Point Media Logo" w="28px" h="28px" objectFit="contain" />
                <Text fontSize="lg" fontWeight="700" color="white">Point Media</Text>
              </HStack>

              <Box mb={8}>
                <Heading size="lg" color="white" mb={2}>
                  {isLogin ? "Bem-vindo de volta!" : "Crie sua conta"}
                </Heading>
                <Text color="gray.400" fontSize="sm">
                  {isLogin ? "Entre com suas credenciais para acessar sua conta" : "Preencha os dados abaixo para começar sua jornada"}
                </Text>
              </Box>

              <VStack spacing={4} align="stretch" as="form" onSubmit={isLogin ? handleSubmitLogin(onLoginSubmit) : handleSubmitSignup(onRegisterSubmit)}>
                {!isLogin && (
                  <FormControl isInvalid={errorsSignup.nome}>
                    <Text fontSize="sm" fontWeight="500" color="white" mb={1}>Nome completo</Text>
                    <InputGroup size="lg">
                      <InputLeftElement pointerEvents="none"><Icon as={FaUser} color="gray.500" fontSize="sm" /></InputLeftElement>
                      <Input placeholder="João Silva" bg="rgba(255,255,255,0.02)" border="1px solid" borderColor="whiteAlpha.200" color="white" fontSize="sm" focusBorderColor="brand.pink" {...registerSignup('nome')} />
                    </InputGroup>
                    <FormErrorMessage fontSize="xs">{errorsSignup.nome?.message}</FormErrorMessage>
                  </FormControl>
                )}

                <FormControl isInvalid={isLogin ? errorsLogin.email : errorsSignup.email}>
                  <Text fontSize="sm" fontWeight="500" color="white" mb={1}>E-mail</Text>
                  <InputGroup size="lg">
                    <InputLeftElement pointerEvents="none"><Icon as={FaEnvelope} color="gray.500" fontSize="sm" /></InputLeftElement>
                    <Input type="email" placeholder="seu@email.com" bg="rgba(255,255,255,0.02)" border="1px solid" borderColor="whiteAlpha.200" color="white" fontSize="sm" focusBorderColor="brand.pink" {...(isLogin ? registerLogin('email') : registerSignup('email'))} />
                  </InputGroup>
                  <FormErrorMessage fontSize="xs">{isLogin ? errorsLogin.email?.message : errorsSignup.email?.message}</FormErrorMessage>
                </FormControl>


                <FormControl isInvalid={isLogin ? errorsLogin.senha : errorsSignup.senha}>
                  <Text fontSize="sm" fontWeight="500" color="white" mb={1}>Senha</Text>
                  <InputGroup size="lg">
                    <InputLeftElement pointerEvents="none"><Icon as={FaLock} color="gray.500" fontSize="sm" /></InputLeftElement>
                    <Input type={showPassword ? 'text' : 'password'} placeholder="••••••••" bg="rgba(255,255,255,0.02)" border="1px solid" borderColor="whiteAlpha.200" color="white" fontSize="sm" focusBorderColor="brand.pink" pr="3rem" {...(isLogin ? registerLogin('senha') : registerSignup('senha'))} />
                    <InputRightElement>
                      <IconButton
                        variant="ghost"
                        size="sm"
                        icon={<Icon as={showPassword ? FaEyeSlash : FaEye} />}
                        color="gray.500"
                        _hover={{ color: 'white' }}
                        onClick={() => setShowPassword(!showPassword)}
                        aria-label={showPassword ? 'Ocultar senha' : 'Mostrar senha'}
                      />
                    </InputRightElement>
                  </InputGroup>
                  <FormErrorMessage fontSize="xs">{isLogin ? errorsLogin.senha?.message : errorsSignup.senha?.message}</FormErrorMessage>
                </FormControl>

                {!isLogin && (
                  <FormControl isInvalid={errorsSignup.confirmarSenha}>
                    <Text fontSize="sm" fontWeight="500" color="white" mb={1}>Confirmar senha</Text>
                    <InputGroup size="lg">
                      <InputLeftElement pointerEvents="none"><Icon as={FaLock} color="gray.500" fontSize="sm" /></InputLeftElement>
                      <Input type={showConfirmPassword ? 'text' : 'password'} placeholder="••••••••" bg="rgba(255,255,255,0.02)" border="1px solid" borderColor="whiteAlpha.200" color="white" fontSize="sm" focusBorderColor="brand.pink" pr="3rem" {...registerSignup('confirmarSenha')} />
                      <InputRightElement>
                        <IconButton
                          variant="ghost"
                          size="sm"
                          icon={<Icon as={showConfirmPassword ? FaEyeSlash : FaEye} />}
                          color="gray.500"
                          _hover={{ color: 'white' }}
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          aria-label={showConfirmPassword ? 'Ocultar senha' : 'Mostrar senha'}
                        />
                      </InputRightElement>
                    </InputGroup>
                    <FormErrorMessage fontSize="xs">{errorsSignup.confirmarSenha?.message}</FormErrorMessage>
                  </FormControl>
                )}

                {isLogin && (
                  <Flex align="center" mt={2}>
                    <Checkbox colorScheme="pink" color="gray.400" size="sm" {...registerLogin('lembrar_me')}>Lembrar de mim</Checkbox>
                  </Flex>
                )}

                <Button type="submit" variant="gradient" size="lg" mt={6} isLoading={loading}>
                  {isLogin ? "Entrar" : "Criar conta"}
                </Button>
              </VStack>

              <Box position="relative" mt={8} mb={6}>
                <Divider borderColor="whiteAlpha.200" />
                <Flex position="absolute" top="50%" left="50%" transform="translate(-50%, -50%)" bg="brand.cardBg" px={4} color="gray.500" fontSize="xs">OU</Flex>
              </Box>

              <Text textAlign="center" fontSize="sm" color="gray.400">
                {isLogin ? "Ainda não tem uma conta? " : "Já possui uma conta? "}
                <Link color="brand.pink" fontWeight="600" onClick={switchMode}>
                  {isLogin ? "Cadastre-se" : "Fazer login"}
                </Link>
              </Text>
            </ModalBody>
          </Box>

        </Flex>
      </ModalContent>
    </Modal>
  );
}

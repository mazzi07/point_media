import React, { useEffect } from 'react';
import {
  Box, Heading, Text, SimpleGrid, Button, useColorModeValue,
  Container, VStack, HStack, Icon, Flex, Tag, Grid, CircularProgress, CircularProgressLabel, Badge
} from '@chakra-ui/react';
import { useAuth } from '../context/useAuth';
import { useNavigate, Navigate } from 'react-router-dom';
import { api } from '../services/api';
import { FaFileAlt, FaAward, FaTrophy, FaRegFileAlt, FaRegCheckCircle, FaRegBuilding, FaCheckCircle } from 'react-icons/fa';
import { useQuery } from '@tanstack/react-query';

export default function Home() {
  const { isLoggedIn, user, hasResume, setHasResume, openAuthModal } = useAuth();
  const navigate = useNavigate();
  const userEmail = user?.email;
  

  const bgCard    = useColorModeValue('brand.lightCardBg', 'brand.cardBg');
  const border    = useColorModeValue('transparent', 'whiteAlpha.100');
  const cardShadow = useColorModeValue('0 8px 30px rgba(0,0,0,0.04)', '0 10px 30px rgba(0,0,0,0.4)');
  const textColor = useColorModeValue('gray.600', 'gray.400');
  const headingColor = useColorModeValue('#1B254B', 'white');
  const hoverBg = useColorModeValue('white', 'whiteAlpha.50');
  const hoverBorder = useColorModeValue('transparent', 'rgba(59, 130, 246, 0.4)'); // Azul brilhante no hover escuro
  const hoverShadow = useColorModeValue('0 12px 35px rgba(0,0,0,0.07)', '0 0 20px rgba(59, 130, 246, 0.15)');
  const iconBg = useColorModeValue('gray.50', 'whiteAlpha.50');
  const iconColor = useColorModeValue('gray.400', 'gray.500');
  const loginColor = useColorModeValue('gray.700', 'white');
  const loginBorder = useColorModeValue('gray.300', 'whiteAlpha.400');
  const loginHoverBg = useColorModeValue('gray.100', 'whiteAlpha.100');
  const [resumeLoadState, setResumeLoadState] = React.useState({ userEmail, status: 'loading' });
  const [resumeLoadAttempt, setResumeLoadAttempt] = React.useState(0);
  if (resumeLoadState.userEmail !== userEmail) {
    setResumeLoadState({ userEmail, status: 'loading' });
  }
  const retryResume = () => {
    setResumeLoadState({ userEmail, status: 'loading' });
    setResumeLoadAttempt(previous => previous + 1);
  };

  // checa se o usuario ja tem curriculo
  useEffect(() => {
    if (!isLoggedIn || !userEmail) return;
    let active = true;
    api.get('/api/curriculo')
      .then((res) => {
        if (!active) return;
        if (!res.ok && res.status !== 404) throw new Error('Falha ao carregar currículo');
        setHasResume(res.ok);
        setResumeLoadState({ userEmail, status: 'ready' });
      })
      .catch(() => { if (active) setResumeLoadState({ userEmail, status: 'error' }); });
    return () => { active = false; };
  }, [isLoggedIn, userEmail, setHasResume, resumeLoadAttempt]);

  const { data: badges = [], isLoading: isLoadingBadges, isError: badgesError, refetch: retryBadges } = useQuery({
    queryKey: ['meus-badges'],
    queryFn: async () => {
      const res = await api.get('/api/quizzes/meus-badges');
      if (!res.ok) throw new Error('Falha ao carregar dados');
      return res.json();
    },
    enabled: isLoggedIn && user?.tipo !== 'ADMIN',
  });

  const { data: quizzes = [], isLoading: isLoadingQuizzes, isError: quizzesError, refetch: retryQuizzes } = useQuery({
    queryKey: ['quizzes-disponiveis'],
    queryFn: async () => {
      const res = await api.get('/api/quizzes');
      if (!res.ok) throw new Error('Falha ao carregar dados');
      return res.json();
    },
    enabled: isLoggedIn && user?.tipo !== 'ADMIN',
  });

  const { data: candidaturas = [], isLoading: isLoadingCandidaturas, isError: candidaturasError, refetch: retryCandidaturas } = useQuery({
    queryKey: ['minhas-candidaturas'],
    queryFn: async () => {
      const res = await api.get('/api/vagas/minhas-candidaturas');
      if (!res.ok) throw new Error('Falha ao carregar dados');
      return res.json();
    },
    enabled: isLoggedIn && user?.tipo !== 'ADMIN',
  });

  // tela logada - dashboard do candidato
  if (isLoggedIn) {
    if (user?.tipo === 'ADMIN') {
      return <Navigate to="/admin" replace />;
    }

    let resumeTitle = hasResume ? 'Currículo ativo' : 'Currículo pendente';
    let resumeDescription = hasResume
      ? 'Currículo cadastrado. Candidate-se a uma vaga para aparecer na lista de candidatos do RH.'
      : 'Monte seu currículo e candidate-se a uma vaga para aparecer na lista de candidatos do RH.';
    let resumeAction = hasResume ? 'Editar currículo' : 'Criar currículo';
    if (resumeLoadState.status === 'loading') {
      resumeTitle = 'Carregando currículo';
      resumeDescription = 'Verificando seu currículo.';
    } else if (resumeLoadState.status === 'error') {
      resumeTitle = 'Currículo indisponível';
      resumeDescription = 'Não foi possível verificar seu currículo. Tente novamente.';
      resumeAction = 'Tentar novamente';
    }

    return (
      <Container maxW="5xl" py={16}>
        <Box mb={12}>
          <Text fontSize="sm" color={textColor} fontWeight="500" mb={2}>Bem-vindo de volta</Text>
          <Heading size="xl" color={headingColor}>{user?.nome || 'Talento'}</Heading>
        </Box>

        <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6} mb={12}>

          <Box bg={bgCard} border="1px solid" borderColor={border} boxShadow={cardShadow} rounded="2xl" p={8} 
               transition="all 0.3s" _hover={{ borderColor: hoverBorder, boxShadow: hoverShadow, transform: 'translateY(-4px)' }}>
            <HStack spacing={4} mb={6}>
              <Flex w={10} h={10} align="center" justify="center"
                bg={hasResume ? 'rgba(59, 130, 246, 0.1)' : 'rgba(213, 24, 123, 0.1)'} rounded="lg">
                <Icon as={FaFileAlt} color={hasResume ? 'brand.blue' : 'brand.pink'} w={5} h={5} />
              </Flex>
              <Heading size="md" color={headingColor}>
                {resumeTitle}
              </Heading>
            </HStack>
            <Text fontSize="sm" color={textColor} mb={8} lineHeight="1.6">
              {resumeDescription}
            </Text>
            <Button variant="gradient" size="md" w="full" isLoading={resumeLoadState.status === 'loading'} onClick={() => resumeLoadState.status === 'error' ? retryResume() : navigate('/criar-perfil')}>
              {resumeAction}
            </Button>
          </Box>


          <Box bg={bgCard} border="1px solid" borderColor={border} boxShadow={cardShadow} rounded="2xl" p={8}
               transition="all 0.3s" _hover={{ borderColor: hoverBorder, boxShadow: hoverShadow, transform: 'translateY(-4px)' }}>
            <HStack spacing={4} mb={6}>
              <Flex w={10} h={10} align="center" justify="center" bg="rgba(59, 130, 246, 0.1)" rounded="lg">
                <Icon as={FaAward} color="brand.blue" w={5} h={5} />
              </Flex>
              <Heading size="md" color={headingColor}>Selos de Competência</Heading>
            </HStack>
            {isLoadingBadges ? (
              <CircularProgress isIndeterminate color="brand.blue" size="30px" />
            ) : badgesError ? (
              <Box mb={6}><Text>Não foi possível carregar suas avaliações.</Text><Button mt={2} size="sm" onClick={() => retryBadges()}>Tentar novamente</Button></Box>
            ) : badges.filter(b => b.ganhouBadge).length > 0 ? (
              <HStack spacing={3} mb={6} flexWrap="wrap">
                {badges.filter(b => b.ganhouBadge).map(b => (
                  <Tag key={b.quizId} size="lg" borderRadius="full" variant="subtle" colorScheme="blue">
                    <Icon as={FaCheckCircle} mr={2} color="blue.500" />
                    {b.titulo}
                  </Tag>
                ))}
              </HStack>
            ) : (
              <Text fontSize="sm" color={textColor} mb={8} lineHeight="1.6">
                {badges.length > 0 ? 'Você concluiu avaliações, mas ainda não conquistou selos de competência.' : 'Nenhuma avaliação concluída ainda. Realize testes técnicos para validar suas habilidades.'}
              </Text>
            )}
            <Button size="md" variant="outline" borderColor={border}
              fontWeight="500" color={textColor} w="full" borderRadius="8px"
              _hover={{ bg: hoverBg }} onClick={() => navigate('/quizzes')}>
              Acessar Avaliações
            </Button>
          </Box>
        </SimpleGrid>

        <Box mb={12}>
          <Heading size="md" mb={6} color={headingColor}>Minhas Candidaturas</Heading>
          {isLoadingCandidaturas ? (
            <CircularProgress isIndeterminate color="brand.blue" size="30px" />
          ) : candidaturasError ? (
            <Box><Text>Não foi possível carregar suas candidaturas.</Text><Button mt={2} onClick={() => retryCandidaturas()}>Tentar novamente</Button></Box>
          ) : candidaturas.length > 0 ? (
            <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6}>
              {candidaturas.map((cand) => (
                <Box key={cand.vagaId} bg={bgCard} border="1px solid" borderColor={border} boxShadow={cardShadow} rounded="2xl" p={6}
                     transition="all 0.3s" _hover={{ borderColor: hoverBorder, boxShadow: hoverShadow }}>
                  <Badge colorScheme="green" mb={3}>Inscrito</Badge>
                  <Heading size="sm" color={headingColor} mb={2}>{cand.titulo}</Heading>
                  <Text fontSize="xs" color={textColor} mb={4}>Área: {cand.area}</Text>
                  <Text fontSize="xs" color={textColor}>
                    Em: {new Date(cand.dataCandidatura).toLocaleDateString()}
                  </Text>
                </Box>
              ))}
            </SimpleGrid>
          ) : (
            <Box bg={bgCard} border="1px solid" borderColor={border} rounded="xl" p={6} textAlign="center">
              <Text fontSize="sm" color={textColor}>Você ainda não se inscreveu em nenhuma vaga.</Text>
              <Button mt={4} size="sm" variant="outline" borderColor={border} color={textColor} onClick={() => navigate('/vagas')}>
                Ver Vagas Disponíveis
              </Button>
            </Box>
          )}
        </Box>


        <Box>
          <Heading size="md" mb={6} color={headingColor}>Avaliações disponíveis</Heading>
          <VStack spacing={4} align="stretch">
            {isLoadingQuizzes ? (
              <CircularProgress isIndeterminate color="brand.pink" size="30px" />
            ) : quizzesError ? (
              <Box><Text>Não foi possível carregar os quizzes.</Text><Button mt={2} onClick={() => retryQuizzes()}>Tentar novamente</Button></Box>
            ) : quizzes.length === 0 ? <Text>Nenhum quiz disponível.</Text> : quizzes.slice(0, 3).map((quiz) => {
              const myBadge = badges.find(b => b.quizId === quiz.id);
              const completed = !!myBadge;
              const hasBadge = myBadge?.ganhouBadge;
              return (
                <Flex key={quiz.id} bg={bgCard} border="1px solid" borderColor={border} boxShadow={cardShadow} rounded="2xl"
                  p={5} align="center" justify="space-between"
                  transition="all 0.2s" _hover={{ borderColor: hoverBorder, boxShadow: hoverShadow }}>
                  <HStack spacing={4}>
                    <Flex w={10} h={10} align="center" justify="center"
                      bg={completed ? (hasBadge ? 'blue.50' : 'gray.50') : iconBg} rounded="lg">
                      <Icon as={FaTrophy} color={completed ? (hasBadge ? 'blue.400' : 'gray.400') : iconColor} w={4} h={4} />
                    </Flex>
                    <Box>
                      <Text fontSize="md" fontWeight="500" color={headingColor}>{quiz.titulo}</Text>
                      {completed && <Text fontSize="xs" color={hasBadge ? "blue.500" : "gray.500"}>Nota: {(myBadge.total > 0 ? myBadge.acertos / myBadge.total * 100 : 0).toFixed(0)}%</Text>}
                    </Box>
                  </HStack>
                  <Button size="sm" variant={completed ? "ghost" : "outline"} borderColor="whiteAlpha.200" color={completed ? "gray.500" : "brand.pink"}
                    fontWeight="600" _hover={!completed ? { bg: 'brand.pink', color: 'white', borderColor: 'brand.pink' } : {}}
                    borderRadius="6px" isDisabled={completed || badgesError || isLoadingBadges} onClick={() => navigate(`/quizzes/${quiz.id}`)}>
                    {completed ? 'Concluído' : 'Iniciar'}
                  </Button>
                </Flex>
              );
            })}
          </VStack>
        </Box>
      </Container>
    );
  }

  // landing page publica (visitante nao logado)
  return (
    <Box position="relative" overflow="hidden">

      <Box position="absolute" top="-20%" left="-10%" w="50vw" h="50vw" bgGradient="radial(circle, rgba(213,24,123,0.15) 0%, transparent 60%)" filter="blur(80px)" zIndex={-1} pointerEvents="none" />
      <Box position="absolute" top="10%" right="-10%" w="40vw" h="40vw" bgGradient="radial(circle, rgba(59,130,246,0.1) 0%, transparent 60%)" filter="blur(80px)" zIndex={-1} pointerEvents="none" />


      <Container maxW="4xl" pt={24} pb={20} textAlign="center">
        <Text fontSize="xs" fontWeight="700" color="brand.blue" letterSpacing="0.1em" textTransform="uppercase" mb={6}>
          BANCO DE TALENTOS POINT MEDIA
        </Text>
        <Heading as="h1" size="3xl" color={headingColor} lineHeight="1.2" mb={6}>
          Conectamos profissionais qualificados{' '}
          <Text as="span" bgGradient="linear(to-r, #3B82F6, #D5187B)" bgClip="text" fontWeight="800">
            às melhores oportunidades.
          </Text>
        </Heading>
        <Text fontSize="lg" color={textColor} mb={10} maxW="2xl" mx="auto">
          Cadastre-se conosco, valide sua oportunidade talentosa e ganhe visibilidade para empresas parceiras da região.
        </Text>
        <Flex direction={{ base: 'column', sm: 'row' }} gap={4} justify="center">
          <Button variant="gradient" size="lg" px={8} py={7} onClick={() => openAuthModal('register')}>
            Criar Conta Gratuita
          </Button>
          <Button variant="outline" size="lg" px={8} py={7} color={loginColor} borderColor={loginBorder}
            _hover={{ bg: loginHoverBg, borderColor: loginColor }}
            onClick={() => openAuthModal('login')}>
            Fazer Login
          </Button>
        </Flex>
      </Container>


      <Box py={20}>
        <Container maxW="6xl">
          <Box textAlign="center" mb={16}>
            <Text fontSize="xs" fontWeight="700" color="brand.pink" letterSpacing="0.1em" textTransform="uppercase" mb={3}>
              COMO FUNCIONA
            </Text>
            <Heading size="lg" color={headingColor} mb={4}>Sua jornada em três passos</Heading>
            <Text color={textColor} fontSize="sm">Criamos um processo simples para que você encontre trabalho e oportunidades que importam.</Text>
          </Box>

          <Grid templateColumns={{ base: '1fr', md: 'repeat(3, 1fr)' }} gap={8}>
            {[
              { icon: FaRegFileAlt, title: 'Monte seu currículo', desc: 'Preencha seu perfil com dados profissionais, experiências e habilidades. Destaque o que faz você se destacar.' },
              { icon: FaRegCheckCircle, title: 'Valide suas competências', desc: 'Realize avaliações e conquiste selos de competência que comprovam suas habilidades no mercado.' },
              { icon: FaRegBuilding, title: 'Conecte-se com empresas', desc: 'Após cadastrar seu currículo e se candidatar a uma vaga, seu perfil aparece na lista de candidatos do RH.' }
            ].map((step, idx) => (
              <Box key={idx} bg={bgCard} p={8} borderRadius="2xl" border="1px solid" borderColor={border} boxShadow={cardShadow}
                transition="all 0.3s" _hover={{ transform: 'translateY(-8px)', boxShadow: hoverShadow, borderColor: hoverBorder }}>
                <Flex w={10} h={10} bg="rgba(59, 130, 246, 0.1)" borderRadius="8px" align="center" justify="center" mb={6}>
                  <Icon as={step.icon} color="brand.blue" w={5} h={5} />
                </Flex>
                <Heading size="md" color={headingColor} mb={4} fontSize="lg">{step.title}</Heading>
                <Text color={textColor} fontSize="sm" lineHeight="1.6">{step.desc}</Text>
              </Box>
            ))}
          </Grid>
        </Container>
      </Box>


    </Box>
  );
}

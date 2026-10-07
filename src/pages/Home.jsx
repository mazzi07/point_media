import React, { useEffect } from 'react';
import {
  Box, Heading, Text, SimpleGrid, Button,
  Container, VStack, HStack, Icon, Flex, Tag, CircularProgress, Badge
} from '@chakra-ui/react';
import { useAuth } from '../context/useAuth';
import { useNavigate, Navigate } from 'react-router-dom';
import { api } from '../services/api';
import { FaFileAlt, FaAward, FaTrophy, FaCheckCircle } from 'react-icons/fa';
import { useQuery } from '@tanstack/react-query';
import PublicHome from '../components/home/PublicHome';

export default function Home() {
  const { isLoggedIn, user, hasResume, setHasResume, openAuthModal } = useAuth();
  const navigate = useNavigate();
  const userEmail = user?.email;
  
  const [resumeLoadState, setResumeLoadState] = React.useState({ userEmail, status: 'loading' });
  const [resumeLoadAttempt, setResumeLoadAttempt] = React.useState(0);
  if (resumeLoadState.userEmail !== userEmail) {
    setResumeLoadState({ userEmail, status: 'loading' });
  }
  const retryResume = () => {
    setResumeLoadState({ userEmail, status: 'loading' });
    setResumeLoadAttempt(previous => previous + 1);
  };

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

  if (isLoggedIn) {
    if (user?.tipo === 'ADMIN') {
      return <Navigate to="/admin" replace />;
    }

    const badgesEarned = badges.filter(b => b.ganhouBadge);

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
      <Container maxW="content" py={{ base: 8, md: 12 }}>
        <Box mb={10}>
          <Text textStyle="small" color="textSecondary" mb={1}>Bem-vindo de volta,</Text>
          <Heading as="h1" textStyle="h2">{user?.nome || 'Talento'}</Heading>
        </Box>

        <SimpleGrid columns={{ base: 1, lg: 2 }} spacing={6} mb={12}>
          <Box layerStyle="surface">
            <HStack spacing={4} mb={6}>
              <Flex w={10} h={10} align="center" justify="center"
                bg={hasResume ? 'rgba(59, 130, 246, 0.1)' : 'rgba(213, 24, 123, 0.1)'} borderRadius="control">
                <Icon as={FaFileAlt} color={hasResume ? 'brandBlue' : 'brandPink'} />
              </Flex>
              <Heading textStyle="h4">{resumeTitle}</Heading>
            </HStack>
            <Text textStyle="body" color="textSecondary" mb={8}>
              {resumeDescription}
            </Text>
            <Button variant="primary" w="full" isLoading={resumeLoadState.status === 'loading'} onClick={() => resumeLoadState.status === 'error' ? retryResume() : navigate('/criar-perfil')}>
              {resumeAction}
            </Button>
          </Box>

          <Box layerStyle="surface">
            <HStack spacing={4} mb={6}>
              <Flex w={10} h={10} align="center" justify="center" bg="rgba(59, 130, 246, 0.1)" borderRadius="control">
                <Icon as={FaAward} color="brandBlue" />
              </Flex>
              <Heading textStyle="h4">Selos de Competência</Heading>
            </HStack>
            {isLoadingBadges ? (
              <CircularProgress isIndeterminate color="brandBlue" size="30px" mb={6} />
            ) : badgesError ? (
              <Box mb={6}><Text textStyle="body" color="textSecondary">Não foi possível carregar suas avaliações.</Text><Button mt={2} size="sm" variant="secondary" onClick={() => retryBadges()}>Tentar novamente</Button></Box>
            ) : badgesEarned.length > 0 ? (
              <HStack spacing={3} mb={6} flexWrap="wrap">
                {badgesEarned.map(b => (
                  <Tag key={b.quizId} variant="category">
                    <Icon as={FaCheckCircle} mr={2} color="success" />
                    {b.titulo}
                  </Tag>
                ))}
              </HStack>
            ) : (
              <Text textStyle="body" color="textSecondary" mb={8}>
                {badges.length > 0 ? 'Você concluiu avaliações, mas ainda não conquistou selos de competência.' : 'Nenhuma avaliação concluída ainda. Realize testes técnicos para validar suas habilidades.'}
              </Text>
            )}
            <Button variant="secondary" w="full" onClick={() => navigate('/quizzes')}>
              Acessar Avaliações
            </Button>
          </Box>
        </SimpleGrid>

        <Box mb={12}>
          <Heading textStyle="h3" mb={6}>Minhas Candidaturas</Heading>
          {isLoadingCandidaturas ? (
            <CircularProgress isIndeterminate color="brandBlue" size="30px" />
          ) : candidaturasError ? (
            <Box><Text textStyle="body" color="textSecondary">Não foi possível carregar suas candidaturas.</Text><Button mt={2} variant="secondary" onClick={() => retryCandidaturas()}>Tentar novamente</Button></Box>
          ) : candidaturas.length > 0 ? (
            <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6}>
              {candidaturas.map((cand) => (
                <Box key={cand.vagaId} layerStyle="surface">
                  <Badge colorScheme="green" mb={3}>Inscrito</Badge>
                  <Heading textStyle="h4" mb={2}>{cand.titulo}</Heading>
                  <Text textStyle="small" color="textSecondary" mb={2}>Área: {cand.area}</Text>
                  <Text textStyle="metadata" color="textMuted">
                    Em: {new Date(cand.dataCandidatura).toLocaleDateString()}
                  </Text>
                </Box>
              ))}
            </SimpleGrid>
          ) : (
            <Box bg="subtle" border="1px solid" borderColor="border" borderRadius="card" p={6} textAlign="center">
              <Text textStyle="body" color="textSecondary" mb={4}>Você ainda não se inscreveu em nenhuma vaga.</Text>
              <Button variant="secondary" onClick={() => navigate('/vagas')}>
                Ver Vagas Disponíveis
              </Button>
            </Box>
          )}
        </Box>

        <Box>
          <Heading textStyle="h3" mb={6}>Avaliações disponíveis</Heading>
          <VStack spacing={4} align="stretch">
            {isLoadingQuizzes ? (
              <CircularProgress isIndeterminate color="brandPink" size="30px" />
            ) : quizzesError ? (
              <Box><Text textStyle="body" color="textSecondary">Não foi possível carregar os quizzes.</Text><Button mt={2} variant="secondary" onClick={() => retryQuizzes()}>Tentar novamente</Button></Box>
            ) : quizzes.length === 0 ? <Text textStyle="body" color="textSecondary">Nenhum quiz disponível.</Text> : quizzes.slice(0, 3).map((quiz) => {
              const myBadge = badges.find(b => b.quizId === quiz.id);
              const completed = !!myBadge;
              const hasBadge = myBadge?.ganhouBadge;
              return (
                <Flex key={quiz.id} layerStyle="surface" align={{ base: 'flex-start', sm: 'center' }} justify="space-between" direction={{ base: 'column', sm: 'row' }} gap={4}>
                  <HStack spacing={4}>
                    <Flex w={10} h={10} align="center" justify="center"
                      bg={completed ? (hasBadge ? 'rgba(59, 130, 246, 0.1)' : 'surfaceSubtle') : 'surfaceSubtle'} borderRadius="control" flexShrink={0}>
                      <Icon as={FaTrophy} color={completed ? (hasBadge ? 'brandBlue' : 'textMuted') : 'textSecondary'} />
                    </Flex>
                    <Box>
                      <Text textStyle="label">{quiz.titulo}</Text>
                      {completed && <Text textStyle="metadata" color={hasBadge ? "brandBlue" : "textSecondary"}>Nota: {(myBadge.total > 0 ? myBadge.acertos / myBadge.total * 100 : 0).toFixed(0)}%</Text>}
                    </Box>
                  </HStack>
                  <Button size="sm" variant={completed ? "ghost" : "secondary"}
                    isDisabled={completed || badgesError || isLoadingBadges} onClick={() => navigate(`/quizzes/${quiz.id}`)} alignSelf={{ base: 'flex-start', sm: 'auto' }}>
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

  return <PublicHome openAuthModal={openAuthModal} />;
}

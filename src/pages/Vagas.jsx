import { useState } from 'react';
import { Box, Container, Heading, Text, Grid, Flex, useColorModeValue, Button, Tag, HStack, Input, InputGroup, InputLeftElement, Icon, VStack, Divider, useDisclosure, useToast } from '@chakra-ui/react';
import { FaSearch, FaBriefcase } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/useAuth';
import { useQuery } from '@tanstack/react-query';
import { Skeleton, SkeletonCircle } from '@chakra-ui/react';
import { api } from '../services/api';
import VagaCard from '../components/vagas/VagaCard';
import VagaDetailsModal from '../components/vagas/VagaDetailsModal';

export default function Vagas() {
  const { openAuthModal, isLoggedIn, user } = useAuth();
  const navigate = useNavigate();
  const bgCard = useColorModeValue('brand.lightCardBg', 'brand.cardBg');
  const border = useColorModeValue('transparent', 'whiteAlpha.100');
  const cardShadow = useColorModeValue('0 8px 30px rgba(0,0,0,0.04)', '0 10px 30px rgba(0,0,0,0.4)');
  const textColor = useColorModeValue('gray.600', 'gray.400');
  const headingColor = useColorModeValue('#1B254B', 'white');
  const inputBg = useColorModeValue('gray.50', 'whiteAlpha.50');
  const listHoverBg = useColorModeValue('gray.50', 'whiteAlpha.100');

  const [activeFilter, setActiveFilter] = useState('Todos');
  const [searchTerm, setSearchTerm] = useState('');
  const [appliedSearchTerm, setAppliedSearchTerm] = useState('');
  
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [selectedVaga, setSelectedVaga] = useState(null);
  const [isApplying, setIsApplying] = useState(false);
  const toast = useToast();
  
  const handleOpenModal = (vaga) => {
    setSelectedVaga(vaga);
    onOpen();
  };
  
  const filters = ['Todos', 'Design', 'Marketing', 'Desenvolvimento', 'Vendas', 'Gestão'];

  // busca as vagas da api
  const { data: vagas = [], isLoading: isLoadingVagas, isError: vagasError, refetch } = useQuery({
    queryKey: ['vagas', activeFilter, appliedSearchTerm],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (activeFilter !== 'Todos') {
        params.append('area', activeFilter);
      }
      if (appliedSearchTerm) {
        params.append('busca', appliedSearchTerm);
      }
      const response = await api.get(`/api/vagas?${params.toString()}`);
      if (!response.ok) throw new Error('Erro ao buscar vagas');
      return response.json();
    },
    staleTime: 30000,
  });

  const { data: minhasCandidaturas = [], refetch: refetchCandidaturas, isError: candidaturasError } = useQuery({
    queryKey: ['minhas-candidaturas'],
    queryFn: async () => {
      if (!isLoggedIn) return [];
      const response = await api.get('/api/vagas/minhas-candidaturas');
      if (!response.ok) throw new Error('Erro ao buscar candidaturas');
      return response.json();
    },
    enabled: isLoggedIn,
  });

  const handleCandidatar = async () => {
    if (!isLoggedIn) {
      onClose();
      openAuthModal('register');
      return;
    }

    if (!selectedVaga) return;

    setIsApplying(true);
    try {
      const response = await api.post(`/api/vagas/${selectedVaga.id}/candidatar`);
      const data = await response.json();
      
      if (response.ok && data.success) {
        toast({ title: 'Sucesso', description: data.message, status: 'success' });
        refetchCandidaturas();
        onClose();
      } else {
        toast({ title: 'Atenção', description: data.message, status: 'warning' });
      }
    } catch {
      toast({ title: 'Erro', description: 'Não foi possível realizar a candidatura.', status: 'error' });
    } finally {
      setIsApplying(false);
    }
  };

  const handleSearch = () => {
    const nextSearchTerm = searchTerm.trim();
    if (nextSearchTerm === appliedSearchTerm) refetch();
    else setAppliedSearchTerm(nextSearchTerm);
  };

  const VagaSkeleton = () => (
    <Box bg={bgCard} p={6} borderRadius="2xl" border="1px solid" borderColor={border} boxShadow={cardShadow} display="flex" flexDirection="column">
      <Flex justify="space-between" align="flex-start" mb={4}>
        <SkeletonCircle size="12" borderRadius="10px" />
        <Skeleton height="20px" width="60px" borderRadius="full" />
      </Flex>
      <Skeleton height="20px" width="80%" mb={4} />
      <HStack spacing={4} mb={4}>
        <Skeleton height="16px" width="40%" />
      </HStack>
      <HStack spacing={2} mb={6}>
        <Skeleton height="24px" width="50px" borderRadius="full" />
        <Skeleton height="24px" width="60px" borderRadius="full" />
        <Skeleton height="24px" width="70px" borderRadius="full" />
      </HStack>
      <Flex mt="auto" pt={5} borderTop="1px solid" borderColor={border} justify="space-between" align="center">
        <Skeleton height="20px" width="80px" />
        <Skeleton height="32px" width="90px" borderRadius="md" />
      </Flex>
    </Box>
  );

  return (
    <Box pt={16} pb={20} position="relative" overflow="hidden">

      <Box position="absolute" top="10%" right="-10%" w="50vw" h="50vw" bgGradient="radial(circle, rgba(59,130,246,0.1) 0%, transparent 60%)" filter="blur(80px)" zIndex={-1} pointerEvents="none" />
      <Box position="absolute" bottom="0" left="-20%" w="80vw" h="60vw" bgGradient="radial(circle, rgba(213,24,123,0.15) 0%, transparent 60%)" filter="blur(100px)" zIndex={-1} pointerEvents="none" />


      <Container maxW="6xl" textAlign="center" mb={16}>
        <Heading as="h1" size="2xl" color={headingColor} mb={4}>
          Vagas Internas
        </Heading>
        <Text fontSize="md" color={textColor} mb={10}>
          Encontre e faça parte do time oficial da Point Media
        </Text>

        <Box bg={bgCard} p={3} borderRadius="12px" border="1px solid" borderColor={border} maxW="3xl" mx="auto" mb={8}>
          <Flex direction={{ base: 'column', md: 'row' }} gap={3}>
            <InputGroup size="lg" flex="1">
              <InputLeftElement pointerEvents="none">
                <Icon as={FaSearch} color={textColor} fontSize="sm" />
              </InputLeftElement>
              <Input 
                placeholder="Ex: React, Marketing, Design..." 
                bg={inputBg} 
                border="none" 
                fontSize="sm" 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              />
            </InputGroup>
            
            <Button variant="gradient" size="lg" px={8} fontSize="sm" flexShrink={0} onClick={handleSearch}>
              Pesquisar
            </Button>
          </Flex>
        </Box>


        <HStack spacing={3} justify="center" flexWrap="wrap">
          {filters.map(filter => {
            const isActive = activeFilter === filter;
            return (
              <Button key={filter} size="sm" 
                bgGradient={isActive ? 'linear(to-r, #D5187B, #3B82F6)' : 'none'}
                bg={isActive ? undefined : 'transparent'}
                color={isActive ? 'white' : textColor}
                border={isActive ? 'none' : '1px solid'} 
                borderColor={isActive ? 'transparent' : border}
                borderRadius="full" px={5} fontWeight="500"
                boxShadow={isActive ? '0 0 15px rgba(213, 24, 123, 0.4)' : 'none'}
                onClick={() => setActiveFilter(filter)}
                _hover={{ transform: 'translateY(-2px) scale(1.02)', boxShadow: isActive ? '0 0 25px rgba(213, 24, 123, 0.6)' : 'none' }} transition="all 0.2s">
                {filter}
              </Button>
            );
          })}
        </HStack>
      </Container>


      <Box mb={20}>
        <Container maxW="6xl">
          <Flex justify="space-between" align="center" mb={6}>
            <Box>
              <Heading size="md" color={headingColor} mb={1}>Oportunidades Disponíveis</Heading>
              {!isLoadingVagas && !vagasError && <Text fontSize="xs" color={textColor}>{vagas.length} vaga{vagas.length !== 1 ? 's' : ''} encontrada{vagas.length !== 1 ? 's' : ''}</Text>}
            </Box>
          </Flex>

          {vagasError && (
            <Box textAlign="center" py={6}>
              <Text>Não foi possível carregar as vagas.</Text>
              <Button mt={3} onClick={() => refetch()}>Tentar novamente</Button>
            </Box>
          )}
          {candidaturasError && <Text mb={4}>Não foi possível verificar suas candidaturas. <Button size="sm" onClick={() => refetchCandidaturas()}>Tentar novamente</Button></Text>}
          <Grid templateColumns={{ base: '1fr', md: 'repeat(3, 1fr)' }} gap={6}>
            {isLoadingVagas ? (
              <>
                <VagaSkeleton /><VagaSkeleton /><VagaSkeleton />
                <VagaSkeleton /><VagaSkeleton /><VagaSkeleton />
              </>
            ) : vagasError ? null : vagas.map(vaga => (
              <VagaCard key={vaga.id} vaga={vaga} onOpenModal={handleOpenModal} />
            ))}
          </Grid>
          
          {!isLoadingVagas && !vagasError && vagas.length === 0 && (
            <Flex justify="center" py={12}>
              <Text color={textColor}>Nenhuma vaga encontrada com os filtros selecionados.</Text>
            </Flex>
          )}
        </Container>
      </Box>


      {!isLoadingVagas && !vagasError && vagas.length > 0 && (
        <Box mb={24}>
          <Container maxW="6xl">
            <Flex justify="space-between" align="center" mb={6}>
              <Heading size="md" color={headingColor}>Outras Oportunidades</Heading>
            </Flex>

            <VStack spacing={0} align="stretch" bg={bgCard} border="1px solid" borderColor={border} borderRadius="16px" overflow="hidden">
              {vagas.slice(0, 5).map((vaga, idx) => (
                <Box key={vaga.id}>
                  <Flex p={5} align="center" justify="space-between" _hover={{ bg: listHoverBg, transform: 'translateX(4px)' }} transition="all 0.2s" cursor="pointer" onClick={() => handleOpenModal(vaga)}>
                    <HStack spacing={4}>
                      <Flex w={10} h={10} bg="rgba(213, 24, 123, 0.1)" borderRadius="8px" align="center" justify="center">
                        <Icon as={FaBriefcase} color="brand.pink" w={4} h={4} />
                      </Flex>
                      <Box>
                        <Heading size="sm" color={headingColor} mb={1}>{vaga.titulo}</Heading>
                        <HStack spacing={2} color={textColor} fontSize="xs">
                          <Text>Point Media</Text>
                          <Text>•</Text>
                          <Text>{vaga.area}</Text>
                        </HStack>
                      </Box>
                    </HStack>
                    <HStack spacing={6} display={{ base: 'none', md: 'flex' }}>
                      <Tag size="sm" bg="transparent" border="1px solid" borderColor={border} color={textColor} borderRadius="full">{vaga.tipoTrabalho}</Tag>
                      <Text fontWeight="600" color={headingColor} fontSize="sm">{vaga.salario}</Text>
                      <Icon as={FaSearch} color={textColor} w={3} h={3} />
                    </HStack>
                  </Flex>
                  {idx < Math.min(vagas.length - 1, 4) && <Divider borderColor={border} />}
                </Box>
              ))}
            </VStack>
          </Container>
        </Box>
      )}


      <Container maxW="4xl" textAlign="center" mt={20}>
        <Heading size="xl" color={headingColor} mb={4}>
          Pronto para impulsionar sua <Text as="span" bgGradient="linear(to-r, #D5187B, #3B82F6)" bgClip="text">carreira?</Text>
        </Heading>
        <Text color={textColor} fontSize="md" mb={8} maxW="xl" mx="auto">
          Faça parte da nossa equipe e construa o futuro do mercado digital com a Point Media.
        </Text>
        <Button variant="gradient" size="lg" px={8} py={7} onClick={() => isLoggedIn ? navigate(user?.tipo === 'ADMIN' ? '/admin' : '/criar-perfil') : openAuthModal('register')}>
          {isLoggedIn ? (user?.tipo === 'ADMIN' ? 'Ir ao Painel Admin' : 'Preparar meu Currículo') : 'Criar Conta e Candidatar-se'}
        </Button>
      </Container>

      <VagaDetailsModal
        isOpen={isOpen}
        onClose={onClose}
        vaga={selectedVaga}
        isApplied={minhasCandidaturas.some(c => c.vagaId === selectedVaga?.id)}
        isApplying={isApplying}
        applicationStatusUnavailable={candidaturasError || user?.tipo === 'ADMIN'}
        onApply={handleCandidatar}
      />
    </Box>
  );
}

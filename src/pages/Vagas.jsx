import React, { useState } from 'react';
import { Box, Container, Heading, Text, Grid, Flex, useColorModeValue, Button, Tag, HStack, Input, InputGroup, InputLeftElement, Icon, VStack, Divider, Modal, ModalOverlay, ModalContent, ModalHeader, ModalBody, ModalFooter, ModalCloseButton, useDisclosure, useToast } from '@chakra-ui/react';
import { FaSearch, FaBriefcase, FaReact, FaNodeJs, FaFigma, FaLaptopCode, FaPython, FaPalette, FaChartLine, FaRobot, FaAws } from 'react-icons/fa';
import { useAuth } from '../context/useAuth';
import { useQuery } from '@tanstack/react-query';
import { Skeleton, SkeletonCircle, SkeletonText } from '@chakra-ui/react';
import { api } from '../services/api';

export default function Vagas() {
  const { openAuthModal, isLoggedIn } = useAuth();
  const bgCard = useColorModeValue('brand.lightCardBg', 'brand.cardBg');
  const border = useColorModeValue('transparent', 'whiteAlpha.100');
  const cardShadow = useColorModeValue('0 8px 30px rgba(0,0,0,0.04)', '0 10px 30px rgba(0,0,0,0.4)');
  const hoverShadow = useColorModeValue('0 12px 35px rgba(0,0,0,0.07)', '0 0 20px rgba(213, 24, 123, 0.2)');
  const textColor = useColorModeValue('gray.600', 'gray.400');
  const headingColor = useColorModeValue('#1B254B', 'white');
  const inputBg = useColorModeValue('gray.50', 'whiteAlpha.50');
  const listHoverBg = useColorModeValue('gray.50', 'whiteAlpha.100');
  const closeBtnHoverBg = useColorModeValue('gray.50', 'whiteAlpha.100');

  const [activeFilter, setActiveFilter] = useState('Todos');
  const [searchTerm, setSearchTerm] = useState('');
  
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [selectedVaga, setSelectedVaga] = useState(null);
  const [isApplying, setIsApplying] = useState(false);
  const toast = useToast();
  
  const handleOpenModal = (vaga) => {
    setSelectedVaga(vaga);
    onOpen();
  };
  
  const filters = ['Todos', 'Design', 'Marketing', 'Desenvolvimento', 'Vendas', 'Gestão'];

  // retorna um icone baseado na area ou nas habilidades da vaga
  const getIconForSkill = (area, habilidades = []) => {
    const skillList = habilidades.map(h => h.toLowerCase());
    const areaLower = area.toLowerCase();

    if (skillList.includes('react') || skillList.includes('vue.js') || skillList.includes('typescript')) return <Icon as={FaReact} color="white" w={5} h={5} />;
    if (skillList.includes('node.js') || skillList.includes('backend')) return <Icon as={FaNodeJs} color="white" w={5} h={5} />;
    if (skillList.includes('figma') || skillList.includes('illustrator')) return <Icon as={FaFigma} color="white" w={5} h={5} />;
    if (skillList.includes('python')) return <Icon as={FaPython} color="white" w={5} h={5} />;
    if (skillList.includes('aws') || skillList.includes('cloud')) return <Icon as={FaAws} color="white" w={5} h={5} />;
    if (areaLower.includes('design')) return <Icon as={FaPalette} color="white" w={5} h={5} />;
    if (areaLower.includes('marketing') || skillList.includes('seo') || skillList.includes('ads')) return <Icon as={FaChartLine} color="white" w={5} h={5} />;
    

    return <Icon as={FaLaptopCode} color="white" w={5} h={5} />;
  };

  // cor do gradiente baseada na area
  const getGradientForArea = (area) => {
    const areaLower = area.toLowerCase();
    if (areaLower === 'desenvolvimento') return 'linear-gradient(135deg, #0ea5e9, #3b82f6)';
    if (areaLower === 'design') return 'linear-gradient(135deg, #d946ef, #9333ea)';
    if (areaLower === 'marketing') return 'linear-gradient(135deg, #f43f5e, #be123c)';
    return 'linear-gradient(135deg, #10b981, #059669)';
  };

  // cor da tag de tipo de trabalho
  const getTypeColor = (tipo) => {
    if (tipo === 'Remoto') return 'green';
    if (tipo === 'Híbrido') return 'blue';
    return 'orange';
  };

  // busca as vagas da api
  const { data: vagas = [], isLoading: isLoadingVagas, refetch } = useQuery({
    queryKey: ['vagas', activeFilter],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (activeFilter !== 'Todos') {
        params.append('area', activeFilter);
      }
      if (searchTerm) {
        params.append('busca', searchTerm);
      }
      const response = await api.get(`/api/vagas?${params.toString()}`);
      if (!response.ok) throw new Error('Erro ao buscar vagas');
      return response.json();
    },
    staleTime: 30000,
  });

  const { data: minhasCandidaturas = [], refetch: refetchCandidaturas } = useQuery({
    queryKey: ['minhas-candidaturas'],
    queryFn: async () => {
      if (!isLoggedIn) return [];
      const response = await api.get('/api/vagas/minhas-candidaturas');
      if (!response.ok) return [];
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
    refetch();
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
              {!isLoadingVagas && <Text fontSize="xs" color={textColor}>{vagas.length} vaga{vagas.length !== 1 ? 's' : ''} encontrada{vagas.length !== 1 ? 's' : ''}</Text>}
            </Box>
          </Flex>

          <Grid templateColumns={{ base: '1fr', md: 'repeat(3, 1fr)' }} gap={6}>
            {isLoadingVagas ? (
              <>
                <VagaSkeleton /><VagaSkeleton /><VagaSkeleton />
                <VagaSkeleton /><VagaSkeleton /><VagaSkeleton />
              </>
            ) : vagas.map(vaga => (
              <Box key={vaga.id} bg={bgCard} p={6} borderRadius="2xl" border="1px solid" borderColor={border} boxShadow={cardShadow} display="flex" flexDirection="column"
                transition="all 0.3s" _hover={{ transform: 'translateY(-4px)', boxShadow: hoverShadow, borderColor: 'brand.pink' }}>
                <Flex justify="space-between" align="flex-start" mb={4}>
                  <Flex w={12} h={12} borderRadius="10px" background={getGradientForArea(vaga.area)} align="center" justify="center">
                    {getIconForSkill(vaga.area, vaga.habilidades)}
                  </Flex>
                  <Tag size="sm" colorScheme={getTypeColor(vaga.tipoTrabalho)} borderRadius="full" px={3} opacity={0.9} variant="solid">
                    {vaga.tipoTrabalho}
                  </Tag>
                </Flex>
                <Heading size="sm" color={headingColor} mb={2}>{vaga.titulo}</Heading>
                <HStack spacing={4} mb={4} color={textColor} fontSize="xs">
                  <Text><Icon as={FaBriefcase} mr={1} /> Point Media</Text>
                  <Text>{vaga.area}</Text>
                </HStack>
                
                <HStack spacing={2} mb={6} flexWrap="wrap">
                  {vaga.habilidades && vaga.habilidades.map(skill => (
                    <Tag key={skill} size="sm" bg="transparent" border="1px solid" borderColor={border} color={textColor} borderRadius="full" px={3} mt={1}>
                      {skill}
                    </Tag>
                  ))}
                </HStack>

                <Flex mt="auto" pt={5} borderTop="1px solid" borderColor={border} justify="center" align="center">
                  <Button variant="gradient" size="sm" w="full" fontSize="sm" onClick={() => handleOpenModal(vaga)}>
                    Saiba Mais
                  </Button>
                </Flex>
              </Box>
            ))}
          </Grid>
          
          {!isLoadingVagas && vagas.length === 0 && (
            <Flex justify="center" py={12}>
              <Text color={textColor}>Nenhuma vaga encontrada com os filtros selecionados.</Text>
            </Flex>
          )}
        </Container>
      </Box>


      {!isLoadingVagas && vagas.length > 0 && (
        <Box mb={24}>
          <Container maxW="6xl">
            <Flex justify="space-between" align="center" mb={6}>
              <Heading size="md" color={headingColor}>Abertas Recentemente</Heading>
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
        <Button variant="gradient" size="lg" px={8} py={7} onClick={() => openAuthModal('register')}>
          Criar Conta e Candidatar-se
        </Button>
      </Container>


      <Modal isOpen={isOpen} onClose={onClose} size="lg" isCentered>
        <ModalOverlay backdropFilter="blur(4px)" />
        <ModalContent bg={bgCard} border="1px solid" borderColor={border} borderRadius="2xl" mx={4}>
          <ModalHeader pt={6} pb={0}>
            <Heading size="md" color={headingColor}>{selectedVaga?.titulo}</Heading>
          </ModalHeader>
          <ModalCloseButton mt={2} color={textColor} _hover={{ color: headingColor }} />
          <ModalBody py={6}>
            <HStack spacing={4} mb={6} flexWrap="wrap">
              <Tag size="md" bg="rgba(213, 24, 123, 0.1)" color="brand.pink" borderRadius="full" px={4} py={1.5} fontWeight="600">
                <Icon as={FaBriefcase} mr={2} /> Point Media
              </Tag>
              <Tag size="md" colorScheme={selectedVaga ? getTypeColor(selectedVaga.tipoTrabalho) : 'gray'} borderRadius="full" px={4} py={1.5} variant="solid">
                {selectedVaga?.tipoTrabalho}
              </Tag>
            </HStack>

            <Box mb={6}>
              <Text fontSize="sm" fontWeight="600" color={headingColor} mb={2}>Área de Atuação</Text>
              <Text fontSize="sm" color={textColor}>{selectedVaga?.area}</Text>
            </Box>

            <Box mb={6}>
              <Text fontSize="sm" fontWeight="600" color={headingColor} mb={2}>Salário / Remuneração</Text>
              <Text fontSize="sm" color="green.400" fontWeight="600">{selectedVaga?.salario}</Text>
            </Box>

            <Box>
              <Text fontSize="sm" fontWeight="600" color={headingColor} mb={3}>Habilidades Desejadas</Text>
              <HStack spacing={2} flexWrap="wrap">
                {selectedVaga?.habilidades?.map(skill => (
                  <Tag key={skill} size="md" bg="rgba(59, 130, 246, 0.1)" color="brand.blue" borderRadius="full" px={4} py={1.5} mb={2}>
                    {skill}
                  </Tag>
                ))}
              </HStack>
            </Box>
          </ModalBody>

          <ModalFooter borderTop="1px solid" borderColor={border} pt={5} pb={6}>
            <Button variant="outline" mr={3} onClick={onClose} borderColor={border} color={textColor} _hover={{ bg: closeBtnHoverBg }}>
              Fechar
            </Button>
            {minhasCandidaturas.some(c => c.vagaId === selectedVaga?.id) ? (
              <Button colorScheme="green" flex="1" isDisabled>
                Já Candidatado
              </Button>
            ) : (
              <Button variant="gradient" flex="1" isLoading={isApplying} onClick={handleCandidatar}>
                Candidatar-se agora
              </Button>
            )}
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
}

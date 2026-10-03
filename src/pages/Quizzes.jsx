import React from 'react';
import {
  Box, Container, Heading, Text, Grid, Flex, Button, HStack, VStack,
  Tag, Icon, useColorModeValue, Skeleton, SkeletonText, Tabs, TabList, TabPanels, Tab, TabPanel, Avatar, Divider, CircularProgress, CircularProgressLabel
} from '@chakra-ui/react';
import { FaPlay, FaMedal, FaTrophy, FaStar, FaBrain, FaCode, FaChartBar } from 'react-icons/fa';
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';

export default function Quizzes() {
  const navigate = useNavigate();
  const { isLoggedIn, openAuthModal } = useAuth();
  
  const bgCard = useColorModeValue('white', 'brand.cardBg');
  const border = useColorModeValue('gray.200', 'whiteAlpha.100');
  const textColor = useColorModeValue('gray.600', 'gray.400');
  const headingColor = useColorModeValue('gray.900', 'white');
  const rankHoverBg = useColorModeValue('gray.50', 'whiteAlpha.50');

  // lista de quizzes disponiveis
  const { data: quizzes = [], isLoading: isLoadingQuizzes } = useQuery({
    queryKey: ['quizzes'],
    queryFn: async () => {
      const res = await api.get('/api/quizzes');
      if (!res.ok) throw new Error('Falha ao carregar quizzes');
      return res.json();
    }
  });

  // ranking geral dos candidatos
  const { data: ranking = [], isLoading: isLoadingRanking } = useQuery({
    queryKey: ['ranking'],
    queryFn: async () => {
      const res = await api.get('/api/quizzes/ranking');
      if (!res.ok) throw new Error('Falha ao carregar ranking');
      return res.json();
    }
  });

  const handleStartQuiz = (id) => {
    if (!isLoggedIn) {
      openAuthModal('login');
      return;
    }
    navigate(`/quizzes/${id}`);
  };

  const getCategoryIcon = (cat) => {
    if (cat.toLowerCase().includes('frontend')) return <FaCode />;
    if (cat.toLowerCase().includes('marketing')) return <FaChartBar />;
    return <FaBrain />;
  };

  return (
    <Box pt={16} pb={20} position="relative" overflow="hidden">

      <Box position="absolute" top="-10%" left="-10%" w="50vw" h="50vw" bgGradient="radial(circle, rgba(59,130,246,0.15) 0%, transparent 60%)" filter="blur(80px)" zIndex={-1} />

      <Container maxW="6xl">
        <Tabs variant="soft-rounded" colorScheme="pink" isLazy>
          <Flex justify="center" mb={10}>
            <TabList bg={bgCard} p={1} borderRadius="full" border="1px solid" borderColor={border}>
              <Tab borderRadius="full" px={8} fontSize="sm" fontWeight="600" color={textColor} _selected={{ color: 'white', bgGradient: 'linear(to-r, brand.pink, brand.blue)' }}>Quizzes</Tab>
              <Tab borderRadius="full" px={8} fontSize="sm" fontWeight="600" color={textColor} _selected={{ color: 'white', bgGradient: 'linear(to-r, brand.pink, brand.blue)' }}>Ranking</Tab>
            </TabList>
          </Flex>

          <TabPanels>

            <TabPanel p={0}>
              <Box textAlign="center" mb={12}>
                <Text fontSize="xs" fontWeight="700" color="brand.pink" letterSpacing="0.1em" textTransform="uppercase" mb={3}>Quiz Técnico</Text>
                <Heading size="2xl" color={headingColor} mb={4}>
                  Teste seus <Text as="span" color="brand.blue">conhecimentos</Text><br/>
                  e evolua sua carreira
                </Heading>
                <Text color={textColor} maxW="2xl" mx="auto">
                  Responda questões sobre tecnologia e marketing digital e descubra seu nível de conhecimento nas principais áreas do mercado.
                </Text>
              </Box>

              <Grid templateColumns={{ base: '1fr', md: 'repeat(3, 1fr)' }} gap={6}>
                {isLoadingQuizzes ? (
                  Array(3).fill(0).map((_, i) => (
                    <Box key={i} bg={bgCard} p={6} borderRadius="xl" border="1px solid" borderColor={border}>
                      <Skeleton height="40px" width="40px" mb={4} borderRadius="md" />
                      <SkeletonText noOfLines={3} mb={6} />
                      <Skeleton height="40px" />
                    </Box>
                  ))
                ) : quizzes.map(quiz => (
                  <Box key={quiz.id} bg={bgCard} p={6} borderRadius="2xl" border="1px solid" borderColor={border} 
                    transition="all 0.3s" _hover={{ transform: 'translateY(-5px)', boxShadow: '0 10px 30px rgba(0,0,0,0.1)', borderColor: 'brand.pink' }}>
                    <Flex w={12} h={12} bg="rgba(213, 24, 123, 0.1)" color="brand.pink" borderRadius="xl" align="center" justify="center" mb={5} fontSize="xl">
                      {getCategoryIcon(quiz.categoria)}
                    </Flex>
                    <Heading size="md" color={headingColor} mb={2}>{quiz.titulo}</Heading>
                    <HStack fontSize="xs" color={textColor} mb={4} spacing={3}>
                      <Text>{quiz.totalPerguntas} questões</Text>
                      <Text>•</Text>
                      <Text>{quiz.nivel}</Text>
                    </HStack>
                    <Text fontSize="sm" color={textColor} mb={6} noOfLines={3}>
                      {quiz.descricao}
                    </Text>
                    <Flex gap={3}>
                      {quiz.isRespondido ? (
                        <Button flex="1" variant="ghost" colorScheme="green" leftIcon={<FaMedal />} isDisabled>
                          Concluído
                        </Button>
                      ) : (
                        <Button flex="1" variant="gradient" onClick={() => handleStartQuiz(quiz.id)}>
                          Iniciar Quiz
                        </Button>
                      )}
                    </Flex>
                  </Box>
                ))}
              </Grid>
            </TabPanel>


            <TabPanel p={0}>
              <Box textAlign="center" mb={12}>
                <Text fontSize="xs" fontWeight="700" color="brand.pink" letterSpacing="0.1em" textTransform="uppercase" mb={3}>Ranking de Candidatos</Text>
                <Heading size="2xl" color={headingColor} mb={4}>
                  Os melhores talentos,<br/>
                  reconhecidos pelo <Text as="span" color="brand.blue">desempenho.</Text>
                </Heading>
                <Text color={textColor} maxW="2xl" mx="auto">
                  Confira o ranking geral dos candidatos com base no desempenho nos quizzes técnicos.
                </Text>
              </Box>

              {isLoadingRanking ? (
                <Flex justify="center" py={20}><CircularProgress isIndeterminate color="brand.pink" /></Flex>
              ) : ranking.length === 0 ? (
                <Flex justify="center" py={12}><Text color={textColor}>Ainda não há candidatos no ranking. Seja o primeiro!</Text></Flex>
              ) : (
                <>

                  <Flex justify="center" align="flex-end" gap={{ base: 4, md: 8 }} mb={16} flexWrap="wrap">
                    {/* segundo lugar */}
                    {ranking[1] && (
                      <Box bg={bgCard} p={6} borderRadius="2xl" border="1px solid" borderColor={border} w="280px" textAlign="center" position="relative" mt={10}>
                        <Flex position="absolute" top="-20px" left="50%" transform="translateX(-50%)" w="40px" h="40px" bg="gray.400" borderRadius="full" align="center" justify="center" color="white" fontWeight="bold" border="4px solid" borderColor="brand.bg">2</Flex>
                        <Avatar size="xl" src={ranking[1].avatar} name={ranking[1].nome} mb={4} mt={4} border="4px solid" borderColor="gray.400" />
                        <Heading size="md" color={headingColor}>{ranking[1].nome}</Heading>
                        <Text fontSize="xs" color={textColor} mb={2}>@{ranking[1].email.split('@')[0]}</Text>
                        <Heading size="lg" color="brand.pink" mb={3}>{ranking[1].pontuacaoGeral} pts</Heading>
                      </Box>
                    )}

                    {/* primeiro lugar */}
                    {ranking[0] && (
                      <Box bg={bgCard} p={8} borderRadius="2xl" border="2px solid" borderColor="brand.pink" w="320px" textAlign="center" position="relative" boxShadow="0 0 40px rgba(213, 24, 123, 0.2)" zIndex={2}>
                        <Flex position="absolute" top="-25px" left="50%" transform="translateX(-50%)" w="50px" h="50px" bg="yellow.400" borderRadius="full" align="center" justify="center" color="gray.900" fontWeight="bold" fontSize="xl" border="4px solid" borderColor="brand.bg" boxShadow="0 0 15px rgba(236, 201, 75, 0.6)">1</Flex>
                        <Icon as={FaTrophy} color="yellow.400" position="absolute" top={4} right={4} fontSize="xl" />
                        <Avatar size="2xl" src={ranking[0].avatar} name={ranking[0].nome} mb={4} mt={4} border="4px solid" borderColor="yellow.400" />
                        <Heading size="lg" color={headingColor}>{ranking[0].nome}</Heading>
                        <Text fontSize="sm" color={textColor} mb={2}>@{ranking[0].email.split('@')[0]}</Text>
                        <Heading size="xl" bgGradient="linear(to-r, brand.pink, brand.blue)" bgClip="text" mb={3}>{ranking[0].pontuacaoGeral} pts</Heading>
                      </Box>
                    )}

                    {/* terceiro lugar */}
                    {ranking[2] && (
                      <Box bg={bgCard} p={6} borderRadius="2xl" border="1px solid" borderColor={border} w="280px" textAlign="center" position="relative" mt={10}>
                        <Flex position="absolute" top="-20px" left="50%" transform="translateX(-50%)" w="40px" h="40px" bg="orange.400" borderRadius="full" align="center" justify="center" color="white" fontWeight="bold" border="4px solid" borderColor="brand.bg">3</Flex>
                        <Avatar size="xl" src={ranking[2].avatar} name={ranking[2].nome} mb={4} mt={4} border="4px solid" borderColor="orange.400" />
                        <Heading size="md" color={headingColor}>{ranking[2].nome}</Heading>
                        <Text fontSize="xs" color={textColor} mb={2}>@{ranking[2].email.split('@')[0]}</Text>
                        <Heading size="lg" color="brand.pink" mb={3}>{ranking[2].pontuacaoGeral} pts</Heading>
                      </Box>
                    )}
                  </Flex>

                  {/* resto da lista */}
                  {ranking.length > 3 && (
                    <Box bg={bgCard} borderRadius="2xl" border="1px solid" borderColor={border} overflow="hidden">
                      <Flex p={4} borderBottom="1px solid" borderColor={border} fontSize="xs" fontWeight="600" color={textColor} textTransform="uppercase">
                        <Box flex="1" maxW="80px" textAlign="center">Posição</Box>
                        <Box flex="3">Candidato</Box>
                        <Box flex="2" textAlign="center" display={{ base: 'none', md: 'block' }}>Quizzes</Box>
                        <Box flex="2" textAlign="center" display={{ base: 'none', md: 'block' }}>Média de Acertos</Box>
                        <Box flex="2" textAlign="right">Pontuação</Box>
                      </Flex>
                      
                      {ranking.slice(3).map((cand, index) => (
                        <Flex key={cand.usuarioId} p={4} align="center" borderBottom="1px solid" borderColor={border} _last={{ borderBottom: 'none' }} _hover={{ bg: rankHoverBg }}>
                          <Box flex="1" maxW="80px" textAlign="center" fontWeight="bold" color={textColor}>{index + 4}</Box>
                          <Flex flex="3" align="center" gap={3}>
                            <Avatar size="sm" src={cand.avatar} name={cand.nome} />
                            <Box>
                              <Text fontWeight="600" color={headingColor} fontSize="sm">{cand.nome}</Text>
                              <Text fontSize="xs" color={textColor}>@{cand.email.split('@')[0]}</Text>
                            </Box>
                          </Flex>
                          <Box flex="2" textAlign="center" display={{ base: 'none', md: 'block' }} color={textColor} fontSize="sm">{cand.quizzesRealizados}</Box>
                          <Box flex="2" textAlign="center" display={{ base: 'none', md: 'block' }} color="green.400" fontWeight="600" fontSize="sm">{Number(cand.mediaAcertos).toFixed(0)}%</Box>
                          <Box flex="2" textAlign="right" color="brand.pink" fontWeight="700" fontSize="md">{cand.pontuacaoGeral} pts</Box>
                        </Flex>
                      ))}
                    </Box>
                  )}
                </>
              )}
            </TabPanel>
          </TabPanels>
        </Tabs>
      </Container>
    </Box>
  );
}

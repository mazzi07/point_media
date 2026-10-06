import React from 'react';
import { Box, Container, Heading, Text, Grid, Flex, Icon, useColorModeValue, Button, Tag, HStack } from '@chakra-ui/react';
import { FaRegLightbulb, FaBullseye, FaUsers, FaPaintBrush, FaChartLine, FaCogs, FaDatabase } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/useAuth';

export default function Sobre() {
  const { openAuthModal, isLoggedIn, user } = useAuth();
  const navigate = useNavigate();
  const bgCard = useColorModeValue('white', 'brand.cardBg');
  const border = useColorModeValue('gray.200', 'whiteAlpha.100');
  const textColor = useColorModeValue('gray.600', 'gray.400');
  const headingColor = useColorModeValue('gray.900', 'white');

  return (
    <Box pt={24} pb={20} position="relative" overflow="hidden">

      <Box position="absolute" top="10%" left="-10%" w="40vw" h="40vw" bgGradient="radial(circle, rgba(59,130,246,0.1) 0%, transparent 60%)" filter="blur(80px)" zIndex={-1} pointerEvents="none" />
      <Box position="absolute" bottom="0" right="-10%" w="50vw" h="50vw" bgGradient="radial(circle, rgba(213,24,123,0.1) 0%, transparent 60%)" filter="blur(80px)" zIndex={-1} pointerEvents="none" />


      <Container maxW="3xl" textAlign="center" mb={24}>
        <Text display="inline-block" px={4} py={1} borderRadius="full" fontSize="xs" fontWeight="600" 
              color="brand.pink" border="1px solid" borderColor="rgba(213, 24, 123, 0.3)" mb={6}>
          Quem Somos
        </Text>
        <Heading as="h1" size="2xl" color={headingColor} lineHeight="1.3" mb={6}>
          Transformando o <Text as="span" bgGradient="linear(to-r, #3B82F6, #D5187B)" bgClip="text">mercado digital</Text><br/> desde 2017
        </Heading>
        <Text fontSize="lg" color={textColor} lineHeight="1.8">
          A POINT MEDIA é uma empresa que atua no mercado digital desde 2017, especializada em criação de peças digitais e gestão de mídia online. Nossa abordagem criativa e foco em inovação oferecem soluções completas para melhorar a presença digital de clientes e agências.
        </Text>
      </Container>


      <Box mb={24}>
        <Container maxW="6xl">
          <Box textAlign="center" mb={12}>
            <Text fontSize="xs" fontWeight="700" color="brand.pink" letterSpacing="0.1em" textTransform="uppercase" mb={3}>
              Nossos Valores
            </Text>
            <Heading size="lg" color={headingColor}>O que nos move</Heading>
          </Box>

          <Grid templateColumns={{ base: '1fr', md: 'repeat(3, 1fr)' }} gap={8}>
            {[
              { icon: FaRegLightbulb, title: 'Inovação', desc: 'Utilizamos tecnologias avançadas como ad servers e mídia programática para garantir campanhas mais eficientes.' },
              { icon: FaBullseye, title: 'Foco em Resultados', desc: 'Criamos hubs de performance orientados por dados, garantindo campanhas mais eficientes e mensuráveis.' },
              { icon: FaUsers, title: 'Time Experiente', desc: 'Contamos com profissionais experientes do setor, prontos para oferecer as melhores soluções digitais.' }
            ].map((valor, idx) => (
              <Box key={idx} bg={bgCard} p={8} borderRadius="16px" border="1px solid" borderColor={border}
                transition="all 0.3s" _hover={{ transform: 'translateY(-4px)', boxShadow: 'xl', borderColor: 'whiteAlpha.300' }}>
                <Flex w={10} h={10} bg="rgba(59, 130, 246, 0.1)" borderRadius="8px" align="center" justify="center" mb={6}>
                  <Icon as={valor.icon} color="brand.blue" w={5} h={5} />
                </Flex>
                <Heading size="md" color={headingColor} mb={4} fontSize="lg">{valor.title}</Heading>
                <Text color={textColor} fontSize="sm" lineHeight="1.6">{valor.desc}</Text>
              </Box>
            ))}
          </Grid>
        </Container>
      </Box>


      <Box mb={24}>
        <Container maxW="6xl">
          <Box textAlign="center" mb={12}>
            <Text fontSize="xs" fontWeight="700" color="brand.pink" letterSpacing="0.1em" textTransform="uppercase" mb={3}>
              Nossos Serviços
            </Text>
            <Heading size="lg" color={headingColor} mb={4}>Soluções completas para sua presença digital</Heading>
            <Text color={textColor} fontSize="sm" maxW="2xl" mx="auto">Oferecemos uma gama completa de serviços especializados em mídia digital e criação de conteúdo.</Text>
          </Box>

          <Grid templateColumns={{ base: '1fr', md: 'repeat(2, 1fr)' }} gap={6}>
            {[
              { icon: FaPaintBrush, title: 'Criação de Peças Digitais', desc: 'Desenvolvimento de banners HTML5, vídeos e imagens com foco em performance e conversão.', tags: ['Banners HTML5', 'Vídeos', 'Design'] },
              { icon: FaChartLine, title: 'Gestão de Mídia Online', desc: 'Configuração, acompanhamento, otimização e análise completa de campanhas digitais.', tags: ['Configuração', 'Otimização', 'Análise'] },
              { icon: FaCogs, title: 'Planejamento Estratégico', desc: 'Desenvolvimento de estratégias completas para campanhas digitais de alto impacto.', tags: ['Estratégia', 'Campanhas', 'Performance'] },
              { icon: FaDatabase, title: 'Tecnologia Avançada', desc: 'Uso de ad servers e mídia programática para campanhas orientadas por dados.', tags: ['Ad Servers', 'Programática', 'Data Driven'] }
            ].map((servico, idx) => (
              <Box key={idx} bg={bgCard} p={8} borderRadius="16px" border="1px solid" borderColor={border}
                transition="all 0.3s" _hover={{ transform: 'translateY(-4px)', boxShadow: 'xl', borderColor: 'whiteAlpha.300' }}>
                <HStack align="flex-start" spacing={5}>
                  <Flex w={10} h={10} bg="rgba(213, 24, 123, 0.1)" borderRadius="8px" align="center" justify="center" flexShrink={0}>
                    <Icon as={servico.icon} color="brand.pink" w={4} h={4} />
                  </Flex>
                  <Box>
                    <Heading size="sm" color={headingColor} mb={2}>{servico.title}</Heading>
                    <Text color={textColor} fontSize="sm" lineHeight="1.6" mb={4}>{servico.desc}</Text>
                    <HStack spacing={2} flexWrap="wrap">
                      {servico.tags.map(tag => (
                        <Tag key={tag} size="sm" bg="transparent" border="1px solid" borderColor="rgba(213, 24, 123, 0.3)" color="brand.pink" borderRadius="full" px={3} py={1} mt={2}>
                          {tag}
                        </Tag>
                      ))}
                    </HStack>
                  </Box>
                </HStack>
              </Box>
            ))}
          </Grid>
        </Container>
      </Box>


      <Container maxW="4xl" textAlign="center">
        <Heading size="xl" color={headingColor} mb={4}>
          Pronto para transformar sua <Text as="span" bgGradient="linear(to-r, #D5187B, #3B82F6)" bgClip="text">presença digital?</Text>
        </Heading>
        <Text color={textColor} fontSize="md" mb={8} maxW="xl" mx="auto">
          Junte-se a nós e faça parte de uma empresa que está revolucionando o mercado digital.
        </Text>
        <Button variant="gradient" size="lg" px={8} py={7} onClick={() => isLoggedIn ? navigate(user?.tipo === 'ADMIN' ? '/admin' : '/vagas') : openAuthModal('register')}>
          {isLoggedIn ? (user?.tipo === 'ADMIN' ? 'Ir ao Painel Admin' : 'Ver Vagas') : 'Criar Conta Gratuita'}
        </Button>
      </Container>
    </Box>
  );
}

import { Box, Container, Heading, Text, Grid, Flex, Button, Tag, HStack, Divider, VStack } from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/useAuth';

export default function Sobre() {
  const { openAuthModal, isLoggedIn, user } = useAuth();
  const navigate = useNavigate();

  return (
    <Box as="main" pt={{ base: 16, md: 32 }} pb={{ base: 20, md: 32 }}>
      <Container maxW="content">
        {/* Intro */}
        <Grid templateColumns={{ base: '1fr', lg: '2fr 3fr' }} gap={{ base: 8, md: 16 }} mb={24} alignItems="center">
          <Heading as="h1" textStyle="display" color="textPrimary">
            Transformando o mercado digital desde 2017
          </Heading>
          <Box>
            <Text textStyle="body" color="textSecondary" fontSize="lg" maxW="reading">
              A POINT MEDIA é uma empresa especializada em criação de peças digitais e gestão de mídia online.
              Nossa abordagem criativa e foco em inovação oferecem soluções completas para melhorar a presença
              digital de clientes e agências.
            </Text>
          </Box>
        </Grid>

        {/* Valores */}
        <Box mb={24}>
          <Divider borderColor="border" mb={12} />
          <Grid templateColumns={{ base: '1fr', lg: '1fr 3fr' }} gap={{ base: 8, md: 16 }}>
            <Heading textStyle="h3" color="textPrimary">Nossos Valores</Heading>
            <VStack align="stretch" spacing={10}>
              <Box>
                <Heading textStyle="h4" mb={2} display="flex" alignItems="center" gap={3}>
                  <Text as="span" color="brandPink" fontSize="sm">01</Text> Inovação
                </Heading>
                <Text textStyle="body" color="textSecondary" maxW="reading" pl={7}>
                  Utilizamos tecnologias avançadas como ad servers e mídia programática para garantir campanhas mais eficientes.
                </Text>
              </Box>
              <Box>
                <Heading textStyle="h4" mb={2} display="flex" alignItems="center" gap={3}>
                  <Text as="span" color="brandPink" fontSize="sm">02</Text> Foco em Resultados
                </Heading>
                <Text textStyle="body" color="textSecondary" maxW="reading" pl={7}>
                  Criamos hubs de performance orientados por dados, garantindo campanhas mais eficientes e mensuráveis.
                </Text>
              </Box>
              <Box>
                <Heading textStyle="h4" mb={2} display="flex" alignItems="center" gap={3}>
                  <Text as="span" color="brandPink" fontSize="sm">03</Text> Time Experiente
                </Heading>
                <Text textStyle="body" color="textSecondary" maxW="reading" pl={7}>
                  Contamos com profissionais experientes do setor, prontos para oferecer as melhores soluções digitais.
                </Text>
              </Box>
            </VStack>
          </Grid>
        </Box>

        {/* Serviços */}
        <Box mb={24}>
          <Divider borderColor="border" mb={12} />
          <Grid templateColumns={{ base: '1fr', lg: '1fr 3fr' }} gap={{ base: 8, md: 16 }}>
            <Box>
              <Heading textStyle="h3" color="textPrimary" mb={4}>Nossos Serviços</Heading>
              <Text textStyle="body" color="textSecondary" maxW="xs">
                Soluções completas para sua presença digital.
              </Text>
            </Box>

            <VStack align="stretch" spacing={6} divider={<Divider borderColor="border" />}>
              {[
                { title: 'Criação de Peças Digitais', desc: 'Desenvolvimento de banners HTML5, vídeos e imagens com foco em performance e conversão.', tags: ['Banners HTML5', 'Vídeos', 'Design'] },
                { title: 'Gestão de Mídia Online', desc: 'Configuração, acompanhamento, otimização e análise completa de campanhas digitais.', tags: ['Configuração', 'Otimização', 'Análise'] },
                { title: 'Planejamento Estratégico', desc: 'Desenvolvimento de estratégias completas para campanhas digitais de alto impacto.', tags: ['Estratégia', 'Campanhas', 'Performance'] },
                { title: 'Tecnologia Avançada', desc: 'Uso de ad servers e mídia programática para campanhas orientadas por dados.', tags: ['Ad Servers', 'Programática', 'Data Driven'] }
              ].map((servico, idx) => (
                <Box key={idx} py={2}>
                  <Grid templateColumns={{ base: '1fr', md: '1fr 1fr' }} gap={6} alignItems="start">
                    <Box>
                      <Heading textStyle="h4" mb={2}>{servico.title}</Heading>
                      <Text textStyle="body" color="textSecondary">{servico.desc}</Text>
                    </Box>
                    <HStack spacing={2} flexWrap="wrap" justify={{ base: 'flex-start', md: 'flex-end' }}>
                      {servico.tags.map(tag => (
                        <Tag key={tag} variant="category">{tag}</Tag>
                      ))}
                    </HStack>
                  </Grid>
                </Box>
              ))}
            </VStack>
          </Grid>
        </Box>

        {/* CTA */}
        <Box bg="subtle" borderRadius="card" p={{ base: 8, md: 12 }} border="1px solid" borderColor="border">
          <Grid templateColumns={{ base: '1fr', md: '2fr 1fr' }} gap={8} alignItems="center">
            <Box>
              <Heading textStyle="h2" mb={4}>Quer fazer parte da Point Media?</Heading>
              <Text textStyle="body" color="textSecondary">
                Crie seu perfil e acompanhe as oportunidades disponíveis.
              </Text>
            </Box>
            <Flex justify={{ base: 'flex-start', md: 'flex-end' }}>
              <Button variant="primary" size="lg" onClick={() => isLoggedIn ? navigate(user?.tipo === 'ADMIN' ? '/admin' : '/vagas') : openAuthModal('register')}>
                {isLoggedIn ? (user?.tipo === 'ADMIN' ? 'Ir ao Painel Admin' : 'Ver Vagas') : 'Criar Conta Gratuita'}
              </Button>
            </Flex>
          </Grid>
        </Box>

      </Container>
    </Box>
  );
}

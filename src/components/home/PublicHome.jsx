import {
  Box, Button, Container, Flex, Grid, Heading, HStack, Icon,
  Image, SimpleGrid, Tag, Text, VStack, useColorModeValue,
} from '@chakra-ui/react';
import { Link as RouterLink } from 'react-router-dom';
import {
  FiArrowRight, FiAward, FiBriefcase, FiCheck, FiCheckCircle,
  FiFileText, FiGrid, FiMapPin, FiSearch, FiSend, FiUser,
} from 'react-icons/fi';
import logo from '../../assets/point.png';

const steps = [
  { title: 'Crie seu perfil', text: 'Conte sua trajetória. Reúna experiências e habilidades no seu currículo.', icon: FiUser, color: 'brandPink' },
  { title: 'Encontre oportunidades', text: 'Explore as vagas e conheça os requisitos de cada oportunidade.', icon: FiSearch, color: 'brandBlue' },
  { title: 'Candidate-se', text: 'Envie sua candidatura e consulte suas inscrições na plataforma.', icon: FiSend, color: 'brandPink' },
];

const benefits = [
  { title: 'Vagas para explorar', text: 'Veja áreas de atuação, requisitos e detalhes antes de se candidatar.', icon: FiBriefcase, color: 'brandPink' },
  { title: 'Seu currículo reunido', text: 'Organize suas experiências, formação e competências em um só lugar.', icon: FiFileText, color: 'brandBlue' },
  { title: 'Competências em prática', text: 'Faça quizzes técnicos e conquiste selos conforme seu desempenho.', icon: FiAward, color: 'brandPink' },
  { title: 'Candidaturas à mão', text: 'Consulte as vagas em que você se inscreveu, direto na sua Home.', icon: FiCheckCircle, color: 'brandBlue' },
];

function Eyebrow({ children, ...props }) {
  return <Text textStyle="metadata" fontWeight="700" letterSpacing="0.1em" textTransform="uppercase" {...props}>{children}</Text>;
}

// A static illustration, deliberately without interactive-looking form controls
// or real account data. The figure caption makes its illustrative status explicit.
function ProductPreview() {
  return (
    <Box as="figure" m={0} position="relative" w="full" maxW="580px" mx="auto" pt={8} pb={10}>
      <Box aria-hidden="true" position="absolute" inset="0" pointerEvents="none" overflow="hidden">
        <Box position="absolute" right="0" top="0" w="70%" h="85%" bg="brandBlue" opacity={0.14} borderRadius="45% 55% 28% 72%" transform="rotate(8deg)" />
        <Box position="absolute" left="0" bottom="0" w="65%" h="60%" bg="brandPink" opacity={0.12} borderRadius="60% 35% 55% 30%" />
        <Box position="absolute" right={4} top={1} color="brandBlue" fontSize="32px" fontWeight="bold">✳</Box>
        <Box position="absolute" left={1} top="40%" w={3} h={3} border="2px solid" borderColor="brandPink" borderRadius="full" />
      </Box>
      <Box position="relative" mx={{ base: 2, md: 6 }} bg="surface" border="1px solid" borderColor="borderStrong" borderRadius="dialog" boxShadow="xl" overflow="hidden">
        <Flex borderBottom="1px solid" borderColor="border" align="center" justify="space-between" px={{ base: 4, md: 5 }} py={4}>
          <HStack spacing={2}><Image src={logo} alt="" boxSize={6} objectFit="contain" /><Text fontWeight="800" fontSize="sm">Point Media</Text></HStack>
          <HStack aria-hidden="true" spacing={1}>{[0, 1, 2].map(dot => <Box key={dot} w={1.5} h={1.5} borderRadius="full" bg="borderStrong" />)}</HStack>
        </Flex>
        <Flex>
          <VStack aria-hidden="true" display={{ base: 'none', md: 'flex' }} spacing={6} px={4} py={6} bg="subtle" borderRight="1px solid" borderColor="border">
            {[FiGrid, FiBriefcase, FiFileText, FiAward].map((icon, index) => <Icon key={index} as={icon} boxSize={5} color={index === 1 ? 'brandPink' : 'textMuted'} />)}
          </VStack>
          <Box flex={1} minW={0} p={{ base: 4, md: 6 }}>
            <Text textStyle="metadata" color="textSecondary" mb={1}>Seu próximo passo</Text>
            <Text fontSize={{ base: 'lg', md: 'xl' }} fontWeight="700" mb={5}>Oportunidades à vista.</Text>
            <HStack spacing={2} mb={3} color="info"><Icon as={FiBriefcase} /><Text textStyle="label">Explore as vagas</Text></HStack>
            <Box border="1px solid" borderColor="border" borderRadius="card" p={4} bg="page">
              <Flex align="center" justify="space-between" mb={3}><Box bg="surface" borderRadius="control" p={2}><Icon as={FiBriefcase} boxSize={5} color="info" /></Box><Text textStyle="metadata" color="textMuted">Exemplo de vaga</Text></Flex>
              <Text fontWeight="700" mb={2}>Desenvolvedor Frontend</Text>
              <HStack color="textSecondary" mb={4} spacing={1}><Icon as={FiMapPin} boxSize={3} /><Text textStyle="metadata">Remoto</Text></HStack>
              <HStack flexWrap="wrap" spacing={2}><Tag size="sm">React</Tag><Tag size="sm">JavaScript</Tag><Tag size="sm">CSS</Tag></HStack>
            </Box>
            <Flex align="center" gap={3} mt={4} p={3} bg="surfaceSubtle" borderRadius="control">
              <Icon as={FiFileText} color="info" boxSize={5} /><Box><Text textStyle="label">Sua trajetória tem espaço</Text><Text textStyle="metadata" color="textSecondary">Experiências · Formação · Habilidades</Text></Box>
            </Flex>
          </Box>
        </Flex>
      </Box>
      <HStack position="relative" mt={-3} ml={{ base: 0, md: 0 }} w="fit-content" maxW="full" py={3} px={4} spacing={3} bg="elevated" border="1px solid" borderColor="border" borderRadius="card" boxShadow="md">
        <Flex align="center" justify="center" boxSize={10} bg="surfaceSubtle" borderRadius="full"><Icon as={FiAward} color="brandPink" boxSize={6} /></Flex>
        <Box><Text textStyle="label">Mostre suas competências</Text><Text textStyle="metadata" color="textSecondary">Quizzes e selos no seu perfil</Text></Box>
      </HStack>
      <Text as="figcaption" textStyle="metadata" color="textMuted" textAlign="right" mt={3} pr={2}>Visão ilustrativa da plataforma</Text>
    </Box>
  );
}

export default function PublicHome({ openAuthModal }) {
  const heroBackground = useColorModeValue(
    'radial-gradient(ellipse at 85% 65%, rgba(213,24,123,.10), transparent 55%), linear-gradient(120deg, rgba(59,130,246,.07), transparent 65%)',
    'radial-gradient(ellipse at 85% 65%, rgba(213,24,123,.09), transparent 55%), linear-gradient(120deg, rgba(59,130,246,.08), transparent 65%)',
  );
  const stepsBackground = useColorModeValue('rgba(213,24,123,.04)', 'rgba(213,24,123,.035)');
  const headlineAccent = useColorModeValue('brandPink', '#F27AB8');

  return (
    <Box>
      <Box as="section" aria-labelledby="home-title" backgroundImage={heroBackground}>
        <Container py={{ base: 10, md: 12, lg: 16 }}>
          <Grid templateColumns={{ base: 'minmax(0, 1fr)', lg: '1fr 1fr' }} gap={{ base: 6, lg: 10 }} alignItems="center">
            <Box>
              <HStack spacing={2} mb={5}><Box aria-hidden="true" w={2} h={2} bg="brandPink" borderRadius="full" /><Eyebrow color="textSecondary">Banco de talentos Point Media</Eyebrow></HStack>
              <Heading id="home-title" as="h1" fontSize={{ base: '36px', md: '52px', xl: '60px' }} lineHeight={1.08} letterSpacing="-0.045em" maxW="600px">
                Seu talento encontra <Box as="span" color={headlineAccent}>oportunidades.</Box>
              </Heading>
              <Text textStyle="body" fontSize={{ base: 'md', md: 'lg' }} color="textSecondary" maxW="480px" mt={6} mb={7}>
                Faça parte do nosso banco de talentos. Crie seu currículo, explore vagas e mostre suas competências.
              </Text>
              <Flex gap={3} direction={{ base: 'column', sm: 'row' }}>
                <Button variant="primary" size="lg" rightIcon={<FiArrowRight />} onClick={() => openAuthModal('register')}>Criar conta</Button>
                <Button as={RouterLink} to="/vagas" variant="secondary" size="lg" leftIcon={<FiSearch />}>Ver vagas</Button>
              </Flex>
              <HStack mt={7} spacing={3} color="textSecondary" flexWrap="wrap" rowGap={2}>
                <Icon as={FiFileText} color="info" /><Text textStyle="small">Sua trajetória.</Text>
                <Icon as={FiAward} color="brandPink" /><Text textStyle="small">Suas possibilidades.</Text>
              </HStack>
            </Box>
            <ProductPreview />
          </Grid>
        </Container>
      </Box>

      <Box as="section" aria-labelledby="steps-title" bg={stepsBackground} borderY="1px solid" borderColor="border">
        <Container py={{ base: 12, md: 16 }}>
          <Box textAlign="center" maxW="640px" mx="auto" mb={8}>
            <Eyebrow color="textSecondary" mb={3}>Como funciona</Eyebrow>
            <Heading as="h2" id="steps-title" textStyle="h2" fontSize={{ base: '26px', md: '34px' }}>Do seu talento à <Box as="span" color={headlineAccent}>oportunidade.</Box></Heading>
            <Text textStyle="body" color="textSecondary" mt={3}>Três passos para começar a sua jornada na Point Media.</Text>
          </Box>
          <SimpleGrid as="ol" listStyleType="none" m={0} columns={{ base: 1, md: 3 }} spacing={{ base: 4, md: 6 }}>
            {steps.map((step, index) => (
              <Box as="li" key={step.title} position="relative" bg="surface" border="1px solid" borderColor="border" borderRadius="card" p={{ base: 6, md: 5, lg: 8 }}>
                <Flex align="center" justify="space-between" mb={5}>
                  <Text color="textMuted" fontWeight="700" fontSize="sm">0{index + 1}</Text>
                  <Flex w={14} h={14} align="center" justify="center" borderRadius={index === 1 ? 'full' : 'dialog'} bg="surfaceSubtle" position="relative">
                    <Box aria-hidden="true" position="absolute" inset={0} bg={step.color} opacity={0.08} borderRadius="inherit" />
                    <Icon as={step.icon} color={step.color} boxSize={7} />
                  </Flex>
                </Flex>
                <Heading as="h3" textStyle="h4" fontSize="18px" mb={2}>{step.title}</Heading>
                <Text textStyle="small" color="textSecondary">{step.text}</Text>
                <Box aria-hidden="true" mt={5} w={10} h={1} borderRadius="full" bg={step.color} />
                {index < 2 && <Icon aria-hidden="true" as={FiArrowRight} display={{ base: 'none', md: 'block' }} position="absolute" right="-20px" top="45%" zIndex={1} boxSize={4} color="textMuted" />}
              </Box>
            ))}
          </SimpleGrid>
        </Container>
      </Box>

      <Box as="section" aria-labelledby="benefits-title">
        <Container py={{ base: 12, md: 16 }}>
          <Flex justify="space-between" align={{ base: 'flex-start', md: 'flex-end' }} direction={{ base: 'column', md: 'row' }} gap={4} mb={8}>
            <Box maxW="580px"><Eyebrow color="info" mb={3}>Mais possibilidades, no mesmo lugar</Eyebrow><Heading as="h2" id="benefits-title" textStyle="h2" fontSize={{ base: '26px', md: '34px' }}>Além das vagas, espaço para suas <Box as="span" color="info">competências.</Box></Heading></Box>
            <Text textStyle="body" color="textSecondary" maxW="300px">Ferramentas para apresentar o que você sabe e dar o próximo passo.</Text>
          </Flex>
          <SimpleGrid columns={{ base: 1, sm: 2, lg: 4 }} spacing={5}>
            {benefits.map(benefit => (
              <Box key={benefit.title} p={6} border="1px solid" borderColor="border" borderRadius="card" bg="surface">
                <Icon aria-hidden="true" as={benefit.icon} boxSize={7} color={benefit.color} mb={5} />
                <Heading as="h3" textStyle="h4" fontSize="18px" mb={2}>{benefit.title}</Heading>
                <Text textStyle="small" color="textSecondary">{benefit.text}</Text>
              </Box>
            ))}
          </SimpleGrid>
        </Container>
      </Box>

      <Container pb={{ base: 12, md: 16 }}>
        <Grid as="section" aria-labelledby="profile-title" templateColumns={{ base: 'minmax(0, 1fr)', md: '1fr 1fr' }} gap={{ base: 8, md: 12 }} alignItems="center" bg="subtle" border="1px solid" borderColor="border" borderRadius="dialog" p={{ base: 6, md: 8, lg: 12 }}>
          <Box>
            <Eyebrow color="info" mb={3}>Muito mais que um nome no currículo</Eyebrow>
            <Heading as="h2" id="profile-title" textStyle="h2" fontSize={{ base: "26px", md: "32px" }} mb={4}>Sua experiência.<br />Suas habilidades.<br /><Box as="span" color={headlineAccent}>Tudo ganha espaço.</Box></Heading>
            <Text textStyle="body" color="textSecondary" maxW="440px">Reúna sua trajetória profissional e os selos conquistados nos quizzes em um perfil que conta mais sobre você.</Text>
            <Button mt={6} variant="secondary" rightIcon={<FiArrowRight />} onClick={() => openAuthModal('register')}>Começar meu perfil</Button>
          </Box>
          <Box as="figure" m={0} minW={0}>
            <Box bg="surface" border="1px solid" borderColor="border" borderTop="3px solid" borderTopColor="brandBlue" borderRadius="card" p={{ base: 5, lg: 7 }}>
              <HStack spacing={3} mb={6}><Flex align="center" justify="center" boxSize={12} flexShrink={0} bg="surfaceSubtle" borderRadius="full"><Icon as={FiUser} color="info" boxSize={6} /></Flex><Box><Text fontWeight="700">Seu perfil profissional</Text><Text textStyle="metadata" color="textSecondary">Uma trajetória, muitas possibilidades</Text></Box></HStack>
              <VStack align="stretch" spacing={0}>
                {[['Experiências e formação', FiFileText], ['Habilidades e competências', FiCheck], ['Selos conquistados em quizzes', FiAward]].map(([label, icon]) => <HStack key={label} spacing={3} py={4} borderTop="1px solid" borderColor="border"><Icon as={icon} color={icon === FiAward ? 'brandPink' : 'info'} flexShrink={0} /><Text textStyle="small">{label}</Text></HStack>)}
              </VStack>
            </Box>
            <Text as="figcaption" textStyle="metadata" color="textMuted" mt={3}>Representação ilustrativa dos recursos do perfil.</Text>
          </Box>
        </Grid>
      </Container>

      <Container pb={{ base: 12, md: 16 }}>
        <Box as="section" aria-labelledby="cta-title" position="relative" overflow="hidden" borderRadius="dialog" bg="brand.darkBg" backgroundImage="linear-gradient(110deg, rgba(59,130,246,.18), rgba(59,130,246,.55))" color="white" p={{ base: 8, md: 12 }}>
          <Box aria-hidden="true" pointerEvents="none" position="absolute" inset={0}>
            <Box position="absolute" bg="brandPink" w={40} h={40} borderRadius="45% 55% 35% 65%" right={-24} bottom={-20} transform="rotate(-25deg)" />
            <Box position="absolute" border="1px solid" borderColor="whiteAlpha.300" borderRadius="full" boxSize={64} top={-40} left="42%" />
            <Box position="absolute" bg="brandBlue" opacity={0.35} w={24} h={12} bottom={-6} left={4} borderRadius="full" transform="rotate(-25deg)" />
          </Box>
          <Flex position="relative" align={{ base: 'stretch', md: 'center' }} justify="space-between" direction={{ base: 'column', md: 'row' }} gap={7}>
            <Box maxW="580px"><Heading as="h2" id="cta-title" textStyle="h2" fontSize={{ base: "24px", md: "28px" }} mb={3}>Sua próxima oportunidade<br />começa com um primeiro passo.</Heading><Text textStyle="body" color="whiteAlpha.900">Entre para o banco de talentos da Point Media.</Text></Box>
            <Button flexShrink={0} variant="primary" size="lg" rightIcon={<FiArrowRight />} onClick={() => openAuthModal('register')}>Criar minha conta</Button>
          </Flex>
        </Box>
      </Container>
    </Box>
  );
}

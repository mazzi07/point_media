import React from 'react';
import {
  Box, Container, Heading, Text, Flex, HStack, VStack, Tag, TagLabel,
  Avatar, Icon, Button, Divider, SimpleGrid, Badge,
  useColorModeValue, CircularProgress, Spinner
} from '@chakra-ui/react';
import {
  FaBriefcase, FaLinkedin, FaGithub, FaEdit, FaTrophy, FaCheckCircle,
  FaCode, FaClock, FaStar
} from 'react-icons/fa';
import { useAuth } from '../context/useAuth';
import { useNavigate, Navigate } from 'react-router-dom';
import { api } from '../services/api';
import { useQuery } from '@tanstack/react-query';
import html2pdf from 'html2pdf.js';
import ResumePDFTemplate from '../components/ResumePDFTemplate';

export default function Perfil() {
  const { isLoggedIn, user } = useAuth();
  const navigate = useNavigate();
  const [isGeneratingPdf, setIsGeneratingPdf] = React.useState(false);

  const bgCard = useColorModeValue('white', 'brand.cardBg');
  const border = useColorModeValue('gray.200', 'whiteAlpha.100');
  const cardShadow = useColorModeValue('0 4px 20px rgba(0,0,0,0.04)', '0 4px 20px rgba(0,0,0,0.3)');
  const headingColor = useColorModeValue('gray.900', 'white');
  const textColor = useColorModeValue('gray.600', 'gray.400');
  const labelColor = useColorModeValue('gray.400', 'gray.500');
  const tagBg = useColorModeValue('blue.50', 'whiteAlpha.100');
  const tagColor = useColorModeValue('brand.blue', 'white');
  const sectionBg = useColorModeValue('gray.50', 'gray.700');
  const avatarBorderColor = useColorModeValue('white', 'gray.700');

  // Fetch resume data
  const { data: curriculo, isLoading: isLoadingCurriculo } = useQuery({
    queryKey: ['meu-curriculo'],
    queryFn: async () => {
      const res = await api.get('/api/curriculo');
      if (!res.ok) return null;
      return res.json();
    },
    enabled: isLoggedIn,
  });

  // Fetch badges
  const { data: badges = [], isLoading: isLoadingBadges } = useQuery({
    queryKey: ['meus-badges'],
    queryFn: async () => {
      const res = await api.get('/api/quizzes/meus-badges');
      if (!res.ok) return [];
      return res.json();
    },
    enabled: isLoggedIn,
  });

  // Fetch candidaturas
  const { data: candidaturas = [], isLoading: isLoadingCandidaturas } = useQuery({
    queryKey: ['minhas-candidaturas'],
    queryFn: async () => {
      const res = await api.get('/api/vagas/minhas-candidaturas');
      if (!res.ok) return [];
      return res.json();
    },
    enabled: isLoggedIn,
  });

  if (!isLoggedIn) return <Navigate to="/" replace />;
  if (user?.tipo === 'ADMIN') return <Navigate to="/admin" replace />;

  const isLoading = isLoadingCurriculo || isLoadingBadges;

  if (isLoading) {
    return (
      <Flex minH="60vh" align="center" justify="center">
        <Spinner size="lg" color="brand.blue" />
      </Flex>
    );
  }

  const badgesEarned = badges.filter(b => b.ganhouBadge);

  const handleDownloadPDF = () => {
    setIsGeneratingPdf(true);
    setTimeout(() => {
      const element = document.getElementById('perfil-pdf-template');
      const opt = {
        margin:       10,
        filename:     `curriculo_${user?.nome.replace(/\s+/g, '_').toLowerCase()}.pdf`,
        image:        { type: 'jpeg', quality: 0.98 },
        html2canvas:  { scale: 2, useCORS: true },
        jsPDF:        { unit: 'mm', format: 'a4', orientation: 'portrait' }
      };

      html2pdf().set(opt).from(element).save().then(() => {
        setIsGeneratingPdf(false);
      });
    }, 100);
  };

  return (
    <Box pt={16} pb={20} position="relative" overflow="hidden">
      {/* Background blobs */}
      <Box position="absolute" top="-15%" right="-10%" w="40vw" h="40vw"
        bgGradient="radial(circle, rgba(59,130,246,0.08) 0%, transparent 60%)"
        filter="blur(80px)" zIndex={-1} />

      <Container maxW="4xl">
        {/* Profile Header */}
        <Box bg={bgCard} border="1px solid" borderColor={border} boxShadow={cardShadow}
          borderRadius="2xl" p={8} mb={8} position="relative" overflow="hidden">
          {/* Decorative gradient bar */}
          <Box position="absolute" top={0} left={0} right={0} h="4px"
            bgGradient="linear(to-r, brand.pink, brand.blue)" />

          <Flex direction={{ base: 'column', md: 'row' }} align={{ base: 'center', md: 'flex-start' }} gap={6}>
            <Avatar
              size="2xl"
              name={user?.nome}
              src={user?.avatar}
              bg="brand.blue"
              color="white"
              border="4px solid"
              borderColor={avatarBorderColor}
              boxShadow="lg"
            />
            <Box flex={1} textAlign={{ base: 'center', md: 'left' }}>
              <Heading size="lg" color={headingColor} mb={1}>{user?.nome}</Heading>
              <Text fontSize="sm" color={textColor} mb={2}>{user?.email}</Text>
              {curriculo?.cargo && (
                <Badge colorScheme="pink" fontSize="sm" px={3} py={1} borderRadius="full" mb={3}>
                  {curriculo.cargo}
                </Badge>
              )}
              <HStack spacing={4} mt={2} justify={{ base: 'center', md: 'flex-start' }} flexWrap="wrap">
                {curriculo?.linkedin && (
                  <Button as="a" href={curriculo.linkedin.startsWith('http') ? curriculo.linkedin : `https://${curriculo.linkedin}`}
                    target="_blank" size="sm" leftIcon={<FaLinkedin />} colorScheme="linkedin" variant="ghost">
                    LinkedIn
                  </Button>
                )}
                {curriculo?.github && (
                  <Button as="a" href={curriculo.github.startsWith('http') ? curriculo.github : `https://${curriculo.github}`}
                    target="_blank" size="sm" leftIcon={<FaGithub />} variant="ghost" color={textColor}>
                    GitHub
                  </Button>
                )}
                <Button size="sm" onClick={handleDownloadPDF} isLoading={isGeneratingPdf} variant="outline" colorScheme="blue">
                  Baixar PDF
                </Button>
                <Button size="sm" leftIcon={<FaEdit />} variant="gradient" onClick={() => navigate('/criar-perfil')}>
                  Editar Perfil
                </Button>
              </HStack>
            </Box>
          </Flex>
        </Box>

        <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6} mb={8}>
          {/* Experience Section */}
          <Box bg={bgCard} border="1px solid" borderColor={border} boxShadow={cardShadow}
            borderRadius="2xl" p={6}>
            <HStack mb={4}>
              <Icon as={FaBriefcase} color="brand.pink" />
              <Text fontSize="xs" fontWeight="700" textTransform="uppercase" color={labelColor}>
                Experiência
              </Text>
            </HStack>
            {curriculo?.experiencia ? (
              <Text fontSize="sm" color={textColor} whiteSpace="pre-wrap" lineHeight="1.7">
                {curriculo.experiencia}
              </Text>
            ) : (
              <VStack spacing={3} py={4}>
                <Text fontSize="sm" color={labelColor} fontStyle="italic">
                  Nenhuma experiência cadastrada ainda.
                </Text>
                <Button size="sm" variant="outline" borderColor={border} color={textColor}
                  onClick={() => navigate('/criar-perfil')}>
                  Adicionar Experiência
                </Button>
              </VStack>
            )}
          </Box>

          {/* Skills Section */}
          <Box bg={bgCard} border="1px solid" borderColor={border} boxShadow={cardShadow}
            borderRadius="2xl" p={6}>
            <HStack mb={4}>
              <Icon as={FaCode} color="brand.blue" />
              <Text fontSize="xs" fontWeight="700" textTransform="uppercase" color={labelColor}>
                Habilidades ({curriculo?.habilidades?.length || 0})
              </Text>
            </HStack>
            {curriculo?.habilidades && curriculo.habilidades.length > 0 ? (
              <Flex wrap="wrap" gap={2}>
                {curriculo.habilidades.map((skill) => (
                  <Tag key={skill} size="md" rounded="full"
                    bg={tagBg} color={tagColor} border="1px solid" borderColor="brand.blue" px={3}>
                    <TagLabel fontSize="sm">{skill}</TagLabel>
                  </Tag>
                ))}
              </Flex>
            ) : (
              <VStack spacing={3} py={4}>
                <Text fontSize="sm" color={labelColor} fontStyle="italic">
                  Nenhuma habilidade adicionada.
                </Text>
                <Button size="sm" variant="outline" borderColor={border} color={textColor}
                  onClick={() => navigate('/criar-perfil')}>
                  Adicionar Habilidades
                </Button>
              </VStack>
            )}
          </Box>
        </SimpleGrid>

        {/* Badges Section */}
        <Box bg={bgCard} border="1px solid" borderColor={border} boxShadow={cardShadow}
          borderRadius="2xl" p={6} mb={8}>
          <HStack mb={4}>
            <Icon as={FaTrophy} color="yellow.400" />
            <Text fontSize="xs" fontWeight="700" textTransform="uppercase" color={labelColor}>
              Selos de Competência ({badgesEarned.length})
            </Text>
          </HStack>
          {badgesEarned.length > 0 ? (
            <SimpleGrid columns={{ base: 1, sm: 2, md: 3 }} spacing={4}>
              {badgesEarned.map(b => (
                <Box key={b.quizId} bg={sectionBg} p={4} borderRadius="xl" border="1px solid" borderColor={border}>
                  <HStack mb={2}>
                    <Icon as={FaCheckCircle} color="green.400" />
                    <Text fontWeight="600" fontSize="sm" color={headingColor}>{b.titulo}</Text>
                  </HStack>
                  <HStack spacing={4} fontSize="xs" color={textColor}>
                    <HStack>
                      <Icon as={FaStar} color="yellow.400" w={3} h={3} />
                      <Text>{b.nota} pts</Text>
                    </HStack>
                    <Text>{b.acertos}/{b.total} acertos</Text>
                  </HStack>
                </Box>
              ))}
            </SimpleGrid>
          ) : (
            <VStack spacing={3} py={4}>
              <Text fontSize="sm" color={labelColor} fontStyle="italic">
                Nenhum selo conquistado. Faça quizzes para validar suas habilidades!
              </Text>
              <Button size="sm" variant="gradient" onClick={() => navigate('/quizzes')}>
                Fazer Quizzes
              </Button>
            </VStack>
          )}
        </Box>

        {/* Candidaturas Section */}
        <Box bg={bgCard} border="1px solid" borderColor={border} boxShadow={cardShadow}
          borderRadius="2xl" p={6}>
          <HStack mb={4}>
            <Icon as={FaBriefcase} color="brand.blue" />
            <Text fontSize="xs" fontWeight="700" textTransform="uppercase" color={labelColor}>
              Candidaturas ({candidaturas.length})
            </Text>
          </HStack>
          {isLoadingCandidaturas ? (
            <CircularProgress isIndeterminate color="brand.blue" size="30px" />
          ) : candidaturas.length > 0 ? (
            <VStack spacing={3} align="stretch">
              {candidaturas.map((cand) => (
                <Flex key={cand.vagaId} bg={sectionBg} p={4} borderRadius="lg" border="1px solid"
                  borderColor={border} justify="space-between" align="center" flexWrap="wrap" gap={2}>
                  <Box>
                    <Text fontWeight="600" fontSize="sm" color={headingColor}>{cand.titulo || 'Vaga'}</Text>
                    <Text fontSize="xs" color={textColor}>{cand.area}</Text>
                  </Box>
                  <HStack spacing={3}>
                    <Badge colorScheme="green">Inscrito</Badge>
                    <HStack fontSize="xs" color={labelColor}>
                      <Icon as={FaClock} w={3} h={3} />
                      <Text>{new Date(cand.dataCandidatura).toLocaleDateString()}</Text>
                    </HStack>
                  </HStack>
                </Flex>
              ))}
            </VStack>
          ) : (
            <VStack spacing={3} py={4}>
              <Text fontSize="sm" color={labelColor} fontStyle="italic">
                Nenhuma candidatura realizada.
              </Text>
              <Button size="sm" variant="outline" borderColor={border} color={textColor}
                onClick={() => navigate('/vagas')}>
                Ver Vagas
              </Button>
            </VStack>
          )}
        </Box>
      </Container>

      {/* Hidden PDF template for downloading */}
      <div style={{ position: 'absolute', top: '-9999px', left: '-9999px' }}>
        <div id="perfil-pdf-template">
          <ResumePDFTemplate user={user} curriculo={curriculo} habilidades={curriculo?.habilidades || []} />
        </div>
      </div>
    </Box>
  );
}

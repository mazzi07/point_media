import {
  Box, Container, Heading, Text, Flex, useColorModeValue,
  Icon, SimpleGrid, Tabs, TabList, TabPanels, Tab, TabPanel, Button, Spinner
} from '@chakra-ui/react';
import { FaUsers, FaBriefcase, FaGraduationCap, FaChartLine } from 'react-icons/fa';
import { useQuery } from '@tanstack/react-query';
import { api } from '../services/api';
import CandidatosTab from '../components/admin/CandidatosTab';
import VagasTab from '../components/admin/VagasTab';

export default function AdminPage() {
  const border = useColorModeValue('gray.200', 'whiteAlpha.100');
  const cardBg = useColorModeValue('white', 'brand.cardBg');
  const headingColor = useColorModeValue('gray.900', 'white');
  const mutedColor = useColorModeValue('gray.500', 'gray.400');

  const { data: stats, isLoading, isError, refetch } = useQuery({
    queryKey: ['admin_stats'],
    queryFn: async () => {
      const res = await api.get('/api/admin/stats');
      if (!res.ok) throw new Error('Falha ao carregar estatísticas');
      return res.json();
    },
    retry: false,
    staleTime: 30000
  });

  return (
    <Container maxW="6xl" py={12}>

      <Box mb={10}>
        <Text fontSize="xs" fontWeight="600" textTransform="uppercase"
          letterSpacing="0.1em" color="brand.pink" mb={2}>
          Painel RH
        </Text>
        <Heading size="lg" color={headingColor} mb={1}>
          Banco de Candidatos
        </Heading>
        <Text fontSize="sm" color={mutedColor}>
          Visualize e filtre pessoas com currículo e ao menos uma candidatura.
        </Text>
      </Box>

      {isLoading && <Spinner aria-label="Carregando estatísticas" mb={4} />}
      {isError && <Box mb={4}><Text>Não foi possível carregar as estatísticas.</Text><Button mt={2} onClick={() => refetch()}>Tentar novamente</Button></Box>}
      <SimpleGrid columns={{ base: 1, sm: 2, md: 4 }} spacing={4} mb={8}>
        <Box bg={cardBg} p={5} borderRadius="xl" border="1px solid" borderColor={border} boxShadow="sm">
          <Flex align="center" justify="space-between">
            <Box>
              <Text fontSize="xs" fontWeight="600" color={mutedColor} textTransform="uppercase">Candidatos</Text>
              <Heading size="md" color={headingColor} mt={1}>{stats?.totalCandidatos ?? '-'}</Heading>
            </Box>
            <Flex w={10} h={10} borderRadius="lg" bg="rgba(213, 24, 123, 0.1)" color="brand.pink" align="center" justify="center">
              <Icon as={FaUsers} w={5} h={5} />
            </Flex>
          </Flex>
        </Box>

        <Box bg={cardBg} p={5} borderRadius="xl" border="1px solid" borderColor={border} boxShadow="sm">
          <Flex align="center" justify="space-between">
            <Box>
              <Text fontSize="xs" fontWeight="600" color={mutedColor} textTransform="uppercase">Vagas Ativas</Text>
              <Heading size="md" color={headingColor} mt={1}>{stats?.totalVagas ?? '-'}</Heading>
            </Box>
            <Flex w={10} h={10} borderRadius="lg" bg="rgba(59, 130, 246, 0.1)" color="brand.blue" align="center" justify="center">
              <Icon as={FaBriefcase} w={5} h={5} />
            </Flex>
          </Flex>
        </Box>

        <Box bg={cardBg} p={5} borderRadius="xl" border="1px solid" borderColor={border} boxShadow="sm">
          <Flex align="center" justify="space-between">
            <Box>
              <Text fontSize="xs" fontWeight="600" color={mutedColor} textTransform="uppercase">Quizzes Concluídos</Text>
              <Heading size="md" color={headingColor} mt={1}>{stats?.totalQuizzes ?? '-'}</Heading>
            </Box>
            <Flex w={10} h={10} borderRadius="lg" bg="rgba(0, 181, 216, 0.1)" color="cyan.500" align="center" justify="center">
              <Icon as={FaGraduationCap} w={5} h={5} />
            </Flex>
          </Flex>
        </Box>

        <Box bg={cardBg} p={5} borderRadius="xl" border="1px solid" borderColor={border} boxShadow="sm">
          <Flex align="center" justify="space-between">
            <Box>
              <Text fontSize="xs" fontWeight="600" color={mutedColor} textTransform="uppercase">Média de Acertos</Text>
              <Heading size="md" color={headingColor} mt={1}>{stats?.mediaAcertosGeral != null ? `${stats.mediaAcertosGeral}%` : '-'}</Heading>
            </Box>
            <Flex w={10} h={10} borderRadius="lg" bg="rgba(16, 185, 129, 0.1)" color="green.400" align="center" justify="center">
              <Icon as={FaChartLine} w={5} h={5} />
            </Flex>
          </Flex>
        </Box>
      </SimpleGrid>

      <Tabs variant="soft-rounded" colorScheme="pink" isLazy>
        <TabList mb={4}>
          <Tab>Banco de Candidatos</Tab>
          <Tab>Gestão de Vagas</Tab>
        </TabList>
        <TabPanels>
          {/* aba candidatos */}
          <TabPanel px={0} py={4}>
            <CandidatosTab />
          </TabPanel>

          {/* aba gestao de vagas */}
          <TabPanel px={0} py={4}>
            <VagasTab />
          </TabPanel>
        </TabPanels>
      </Tabs>

    </Container>
  );
}

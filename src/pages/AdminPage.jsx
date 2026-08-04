import React, { useState, useEffect } from 'react';
import {
  Box, Container, Heading, Text, Input, Button, HStack, VStack, Flex,
  Tag, Avatar, useColorModeValue,
  Modal, ModalOverlay, ModalContent, ModalHeader, ModalBody,
  ModalFooter, ModalCloseButton, Textarea, useDisclosure, useToast,
  Icon, Skeleton, SkeletonCircle, SkeletonText, SimpleGrid,
  Tabs, TabList, TabPanels, Tab, TabPanel, IconButton, Table, Thead, Tbody, Tr, Th, Td, Badge, FormControl, FormLabel
} from '@chakra-ui/react';
import { FaSearch, FaBell, FaLinkedin, FaGithub, FaEdit, FaTrash, FaPlus, FaBriefcase, FaUsers, FaGraduationCap, FaPaperPlane, FaChartLine } from 'react-icons/fa';
import { useQuery } from '@tanstack/react-query';
import { api } from '../services/api';

export default function AdminPage() {
  const [filtroCargo, setFiltroCargo]           = useState('');
  const [filtroHabilidade, setFiltroHabilidade] = useState('');
  
  // filtro so dispara a query quando clicar em buscar
  const [buscaAtiva, setBuscaAtiva] = useState({ cargo: '', habilidade: '' });

  const [selectedUsuarioId, setSelectedUsuarioId] = useState(null);
  const [selectedNome, setSelectedNome]           = useState('');
  const [notifTitulo, setNotifTitulo]             = useState('');
  const [notifMensagem, setNotifMensagem]         = useState('');
  const [sending, setSending]                     = useState(false);

  const [selectedCand, setSelectedCand]           = useState(null);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { isOpen: isOpenVaga, onOpen: onOpenVaga, onClose: onCloseVaga } = useDisclosure();
  const { isOpen: isOpenCand, onOpen: onOpenCand, onClose: onCloseCand } = useDisclosure();
  const toast  = useToast();
  const border = useColorModeValue('gray.200', 'whiteAlpha.100');
  const cardBg = useColorModeValue('white', 'brand.cardBg');
  const headingColor = useColorModeValue('gray.900', 'white');
  const mutedColor = useColorModeValue('gray.500', 'gray.400');
  const subtleColor = useColorModeValue('gray.400', 'gray.500');
  const nameColor = useColorModeValue('gray.800', 'white');
  const cargoColor = useColorModeValue('gray.600', 'gray.300');
  const tagBg = useColorModeValue('blue.50', 'whiteAlpha.100');
  const tagColor = useColorModeValue('brand.blue', 'white');
  const githubColor = useColorModeValue('gray.600', 'gray.300');
  const cancelColor = useColorModeValue('gray.600', 'gray.300');
  const tableHeaderBg = useColorModeValue('gray.50', 'whiteAlpha.50');
  const tableRowHoverBg = useColorModeValue('gray.50', 'whiteAlpha.50');

  // busca candidatos com filtros
  const { data: candidatos = [], isLoading, isFetching } = useQuery({
    queryKey: ['candidatos', buscaAtiva.cargo, buscaAtiva.habilidade],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (buscaAtiva.cargo)      params.append('cargo', buscaAtiva.cargo);
      if (buscaAtiva.habilidade) params.append('habilidade', buscaAtiva.habilidade);

      const res = await api.get(`/api/admin/candidatos?${params.toString()}`);
      if (!res.ok) throw new Error('Falha na busca');
      return res.json();
    },
    staleTime: 60000,
  });

  const buscar = () => {
    setBuscaAtiva({ cargo: filtroCargo, habilidade: filtroHabilidade });
  };

  const abrirNotificacao = (usuarioId, nome) => {
    setSelectedUsuarioId(usuarioId);
    setSelectedNome(nome);
    setNotifTitulo('');
    setNotifMensagem('');
    onOpen();
  };

  const enviarNotificacao = async () => {
    if (!notifTitulo.trim() || !notifMensagem.trim()) {
      toast({ title: 'Preencha título e mensagem.', status: 'warning', duration: 3000, position: 'top' });
      return;
    }
    setSending(true);
    try {
      const res = await api.post('/api/admin/notificacoes', {
        usuarioId: selectedUsuarioId,
        titulo: notifTitulo,
        mensagem: notifMensagem,
      });
      const data = await res.json();
      if (res.ok && data.success) {
        toast({ title: 'Notificação enviada!', status: 'success', duration: 3000, position: 'top' });
        onClose();
      } else {
        toast({ title: data.message || 'Erro ao enviar.', status: 'error', duration: 3000, position: 'top' });
      }
    } catch {
      toast({ title: 'Erro de conexão.', status: 'error', duration: 3000, position: 'top' });
    } finally {
      setSending(false);
    }
  };

  const { data: stats } = useQuery({
    queryKey: ['admin_stats'],
    queryFn: async () => {
      const res = await api.get('/api/admin/stats');
      if (!res.ok) return null;
      return res.json();
    },
    retry: false,
    staleTime: 30000
  });


  const { data: vagas = [], refetch: refetchVagas, isLoading: isLoadingVagas } = useQuery({
    queryKey: ['admin_vagas'],
    queryFn: async () => {
      const res = await api.get('/api/vagas');
      if (!res.ok) throw new Error('Falha na busca');
      return res.json();
    }
  });

  const [vagaForm, setVagaForm] = useState({ id: null, titulo: '', area: '', salario: '', tipoTrabalho: '', habilidades: '' });
  const [savingVaga, setSavingVaga] = useState(false);

  const abrirModalVaga = (vaga = null) => {
    if (vaga) {
      setVagaForm({
        id: vaga.id, titulo: vaga.titulo, area: vaga.area, salario: vaga.salario,
        tipoTrabalho: vaga.tipoTrabalho, habilidades: vaga.habilidades ? vaga.habilidades.join(', ') : ''
      });
    } else {
      setVagaForm({ id: null, titulo: '', area: '', salario: '', tipoTrabalho: 'Remoto', habilidades: '' });
    }
    onOpenVaga();
  };

  const salvarVaga = async () => {
    setSavingVaga(true);
    const habArray = vagaForm.habilidades.split(',').map(s => s.trim()).filter(s => s);
    const payload = { ...vagaForm, habilidades: habArray };
    try {
      const url = vagaForm.id ? `/api/admin/vagas/${vagaForm.id}` : '/api/admin/vagas';
      const method = vagaForm.id ? 'PUT' : 'POST';
      const res = await api[method.toLowerCase()](url, payload);
      const data = await res.json();
      if (res.ok && data.success) {
        toast({ title: data.message, status: 'success' });
        refetchVagas();
        onCloseVaga();
      } else {
        toast({ title: data.message || 'Erro', status: 'error' });
      }
    } catch {
      toast({ title: 'Erro de conexão.', status: 'error' });
    } finally {
      setSavingVaga(false);
    }
  };

  const deletarVaga = async (id) => {
    if (!window.confirm("Deseja realmente excluir esta vaga?")) return;
    try {
      const res = await api.delete(`/api/admin/vagas/${id}`);
      if (res.ok) {
        toast({ title: 'Vaga excluída.', status: 'success' });
        refetchVagas();
      }
    } catch {
      toast({ title: 'Erro ao excluir.', status: 'error' });
    }
  };


  const CandidatoSkeleton = () => (
    <Box bg={cardBg} border="1px solid" borderColor={border} rounded="lg" p={5}>
      <Flex align="flex-start" justify="space-between" gap={4} flexWrap="wrap">
        <HStack spacing={4} align="flex-start" w="full" maxW="400px">
          <SkeletonCircle size="12" />
          <Box w="full">
            <Skeleton height="16px" w="60%" mb={2} />
            <Skeleton height="12px" w="40%" mb={3} />
            <Skeleton height="14px" w="50%" mb={3} />
            <HStack spacing={2}>
              <Skeleton height="20px" w="60px" borderRadius="full" />
              <Skeleton height="20px" w="60px" borderRadius="full" />
            </HStack>
          </Box>
        </HStack>
        <Skeleton height="32px" w="100px" borderRadius="md" />
      </Flex>
    </Box>
  );

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
          Visualize e filtre candidatos com currículo cadastrado.
        </Text>
      </Box>


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
              <Heading size="md" color={headingColor} mt={1}>{stats?.mediaAcertosGeral ? `${stats.mediaAcertosGeral}%` : '-'}</Heading>
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

      <Box bg={cardBg} border="1px solid" borderColor={border} rounded="lg" p={5} mb={8}>
        <HStack spacing={4} flexWrap="wrap">
          <Input
            placeholder="Cargo ou objetivo"
            value={filtroCargo}
            onChange={(e) => setFiltroCargo(e.target.value)}
            focusBorderColor="brand.blue"
            size="sm"
            maxW="220px"
            onKeyDown={(e) => e.key === 'Enter' && buscar()}
          />
          <Input
            placeholder="Habilidade (ex: React)"
            value={filtroHabilidade}
            onChange={(e) => setFiltroHabilidade(e.target.value)}
            focusBorderColor="brand.blue"
            size="sm"
            maxW="220px"
            onKeyDown={(e) => e.key === 'Enter' && buscar()}
          />
          <Button size="sm" variant="gradient"
            leftIcon={<Icon as={FaSearch} />} px={6} onClick={buscar} isLoading={isFetching && !isLoading}>
            Buscar
          </Button>
          {(buscaAtiva.cargo || buscaAtiva.habilidade) && (
            <Button size="sm" variant="ghost" fontWeight="400"
              color={mutedColor}
              onClick={() => { setFiltroCargo(''); setFiltroHabilidade(''); setBuscaAtiva({ cargo: '', habilidade: '' }); }}>
              Limpar
            </Button>
          )}
        </HStack>
      </Box>


      {isLoading ? (
        <VStack spacing={4} align="stretch">
          <CandidatoSkeleton />
          <CandidatoSkeleton />
          <CandidatoSkeleton />
        </VStack>
      ) : candidatos.length === 0 ? (
        <Box py={16} textAlign="center">
          <Text fontSize="sm" color={subtleColor}>
            Nenhum candidato encontrado com os filtros aplicados.
          </Text>
        </Box>
      ) : (
        <Box opacity={isFetching ? 0.5 : 1} transition="opacity 0.2s">
          <Text fontSize="xs" color={subtleColor} mb={4}>
            {candidatos.length} candidato{candidatos.length !== 1 ? 's' : ''} encontrado{candidatos.length !== 1 ? 's' : ''}
          </Text>
          <VStack spacing={4} align="stretch">
            {candidatos.map((c) => (
              <Box key={c.usuarioId} bg={cardBg} border="1px solid" borderColor={border}
                rounded="lg" p={5} transition="all 0.3s"
                _hover={{ transform: 'translateY(-2px)', borderColor: 'whiteAlpha.300', boxShadow: 'xl' }}>
                <Flex align="flex-start" justify="space-between" gap={4} flexWrap="wrap">
                  <HStack spacing={4} align="flex-start">
                    <Avatar size="md" name={c.nome} src={c.avatar} bg="brand.blue" color="white" />
                    <Box>
                      <Text fontWeight="600" fontSize="sm"
                        color={nameColor}>
                        {c.nome}
                      </Text>
                      <Text fontSize="xs" color={mutedColor} mb={1}>
                        {c.email}
                      </Text>
                      {c.cargo && (
                        <Text fontSize="xs" fontWeight="500"
                          color={cargoColor}>
                          {c.cargo}
                        </Text>
                      )}
                      {c.habilidades && c.habilidades.length > 0 && (
                        <HStack spacing={2} mt={2} flexWrap="wrap">
                          {c.habilidades.map((h) => (
                            <Tag key={h} size="sm" rounded="full"
                              bg={tagBg}
                              color={tagColor} border="1px solid" borderColor="brand.blue" fontSize="10px" px={2}>
                              {h}
                            </Tag>
                          ))}
                        </HStack>
                      )}
                      <HStack spacing={3} mt={2}>
                        {c.linkedin && (
                          <Text as="a" href={c.linkedin} target="_blank" fontSize="xs"
                            color="brand.blue" display="flex" alignItems="center" gap={1}>
                            <Icon as={FaLinkedin} /> LinkedIn
                          </Text>
                        )}
                        {c.github && (
                          <Text as="a" href={c.github} target="_blank" fontSize="xs"
                            color={githubColor}
                            display="flex" alignItems="center" gap={1}>
                            <Icon as={FaGithub} /> GitHub
                          </Text>
                        )}
                      </HStack>
                    </Box>
                  </HStack>

                  <HStack spacing={2}>
                    <Button size="sm" variant="outline" borderColor={border} color={nameColor}
                      onClick={() => { setSelectedCand(c); onOpenCand(); }}>
                      Ver Perfil
                    </Button>
                    <Button size="sm" variant="gradient"
                      leftIcon={<Icon as={FaBell} />} px={4}
                      onClick={() => abrirNotificacao(c.usuarioId, c.nome)}>
                      Notificar
                    </Button>
                  </HStack>
                </Flex>
              </Box>
            ))}
          </VStack>
        </Box>
      )}
      </TabPanel>

      {/* aba gestao de vagas */}
      <TabPanel px={0} py={4}>
        <Flex justify="space-between" align="center" mb={6}>
          <Heading size="md" color={headingColor}>Vagas Cadastradas</Heading>
          <Button variant="gradient" leftIcon={<FaPlus />} onClick={() => abrirModalVaga()}>
            Nova Vaga
          </Button>
        </Flex>

        <Box bg={cardBg} border="1px solid" borderColor={border} rounded="lg" overflow="hidden">
          <Table variant="simple">
            <Thead bg={tableHeaderBg}>
              <Tr>
                <Th>Vaga</Th>
                <Th>Área</Th>
                <Th>Tipo</Th>
                <Th isNumeric>Ações</Th>
              </Tr>
            </Thead>
            <Tbody>
              {isLoadingVagas ? (
                <Tr><Td colSpan={4} textAlign="center" py={10}><Skeleton height="20px" w="100%" /></Td></Tr>
              ) : vagas.length === 0 ? (
                <Tr><Td colSpan={4} textAlign="center" py={10}>Nenhuma vaga cadastrada.</Td></Tr>
              ) : vagas.map(v => (
                <Tr key={v.id} _hover={{ bg: tableRowHoverBg }}>
                  <Td>
                    <Text fontWeight="bold" color={nameColor}>{v.titulo}</Text>
                    <Text fontSize="xs" color={mutedColor}>{v.salario}</Text>
                  </Td>
                  <Td><Badge colorScheme="blue">{v.area}</Badge></Td>
                  <Td><Badge colorScheme={v.tipoTrabalho === 'Remoto' ? 'green' : 'blue'}>{v.tipoTrabalho}</Badge></Td>
                  <Td isNumeric>
                    <HStack justify="flex-end">
                      <IconButton icon={<FaEdit />} size="sm" variant="ghost" colorScheme="blue" onClick={() => abrirModalVaga(v)} aria-label="Editar" />
                      <IconButton icon={<FaTrash />} size="sm" variant="ghost" colorScheme="red" onClick={() => deletarVaga(v.id)} aria-label="Excluir" />
                    </HStack>
                  </Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        </Box>
      </TabPanel>
      </TabPanels>
      </Tabs>

      {/* modal notificacao */}
      <Modal isOpen={isOpen} onClose={onClose} isCentered size="md">
        <ModalOverlay backdropFilter="blur(4px)" />
        <ModalContent bg={cardBg} border="1px solid" borderColor={border} boxShadow="2xl">
          <ModalHeader fontSize="md">Enviar notificação para {selectedNome}</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <VStack spacing={4} align="stretch">
              <Box>
                <Text fontSize="sm" fontWeight="500" mb={1}>Título</Text>
                <Input size="sm" placeholder="Ex: Vaga compatível com seu perfil"
                  value={notifTitulo} onChange={(e) => setNotifTitulo(e.target.value)}
                  focusBorderColor="brand.blue" />
              </Box>
              <Box>
                <Text fontSize="sm" fontWeight="500" mb={1}>Mensagem</Text>
                <Textarea size="sm" rows={4}
                  placeholder="Descreva a oportunidade ou informação relevante..."
                  value={notifMensagem} onChange={(e) => setNotifMensagem(e.target.value)}
                  focusBorderColor="brand.blue" />
              </Box>
            </VStack>
          </ModalBody>
          <ModalFooter gap={3}>
            <Button size="sm" variant="ghost" fontWeight="400" onClick={onClose} color={cancelColor}>Cancelar</Button>
            <Button size="sm" variant="gradient" px={6}
              isLoading={sending} onClick={enviarNotificacao}>
              Enviar
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* modal criar/editar vaga */}
      <Modal isOpen={isOpenVaga} onClose={onCloseVaga} isCentered size="lg">
        <ModalOverlay backdropFilter="blur(4px)" />
        <ModalContent bg={cardBg} border="1px solid" borderColor={border}>
          <ModalHeader fontSize="md">{vagaForm.id ? 'Editar Vaga' : 'Nova Vaga'}</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <VStack spacing={4} align="stretch">
              <FormControl isRequired>
                <FormLabel fontSize="sm" color={mutedColor}>Título da Vaga</FormLabel>
                <Input size="sm" value={vagaForm.titulo} onChange={e => setVagaForm({...vagaForm, titulo: e.target.value})} focusBorderColor="brand.pink" />
              </FormControl>
              <HStack>
                <FormControl isRequired>
                  <FormLabel fontSize="sm" color={mutedColor}>Área</FormLabel>
                  <Input size="sm" value={vagaForm.area} onChange={e => setVagaForm({...vagaForm, area: e.target.value})} focusBorderColor="brand.pink" placeholder="Ex: Design" />
                </FormControl>
                <FormControl isRequired>
                  <FormLabel fontSize="sm" color={mutedColor}>Tipo (Remoto, Presencial)</FormLabel>
                  <Input size="sm" value={vagaForm.tipoTrabalho} onChange={e => setVagaForm({...vagaForm, tipoTrabalho: e.target.value})} focusBorderColor="brand.pink" />
                </FormControl>
              </HStack>
              <FormControl isRequired>
                <FormLabel fontSize="sm" color={mutedColor}>Salário</FormLabel>
                <Input size="sm" value={vagaForm.salario} onChange={e => setVagaForm({...vagaForm, salario: e.target.value})} focusBorderColor="brand.pink" placeholder="Ex: R$ 5.000 - R$ 8.000" />
              </FormControl>
              <FormControl>
                <FormLabel fontSize="sm" color={mutedColor}>Habilidades (separadas por vírgula)</FormLabel>
                <Input size="sm" value={vagaForm.habilidades} onChange={e => setVagaForm({...vagaForm, habilidades: e.target.value})} focusBorderColor="brand.pink" placeholder="React, Node.js, AWS" />
              </FormControl>
            </VStack>
          </ModalBody>
          <ModalFooter gap={3}>
            <Button size="sm" variant="ghost" onClick={onCloseVaga} color={cancelColor}>Cancelar</Button>
            <Button size="sm" variant="gradient" isLoading={savingVaga} onClick={salvarVaga}>Salvar</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* modal perfil do candidato */}
      <Modal isOpen={isOpenCand} onClose={onCloseCand} isCentered size="xl">
        <ModalOverlay backdropFilter="blur(4px)" />
        <ModalContent bg={cardBg} border="1px solid" borderColor={border} borderRadius="2xl">
          <ModalHeader pt={6} pb={2}>
            <HStack spacing={4}>
              <Avatar size="lg" name={selectedCand?.nome} src={selectedCand?.avatar} bg="brand.blue" color="white" />
              <Box>
                <Heading size="md" color={headingColor}>{selectedCand?.nome}</Heading>
                <Text fontSize="xs" color={mutedColor}>{selectedCand?.email}</Text>
                {selectedCand?.cargo && <Badge colorScheme="pink" mt={1}>{selectedCand?.cargo}</Badge>}
              </Box>
            </HStack>
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody py={4}>
            <VStack spacing={5} align="stretch">
              <Box>
                <Text fontSize="xs" fontWeight="700" textTransform="uppercase" color={mutedColor} mb={2}>Resumo de Experiência</Text>
                <Box bg={tableHeaderBg} p={4} borderRadius="md" border="1px solid" borderColor={border}>
                  <Text fontSize="sm" color={nameColor} whiteSpace="pre-wrap">
                    {selectedCand?.experiencia || "Nenhuma informação de experiência cadastrada."}
                  </Text>
                </Box>
              </Box>

              <Box>
                <Text fontSize="xs" fontWeight="700" textTransform="uppercase" color={mutedColor} mb={2}>Habilidades</Text>
                <HStack spacing={2} flexWrap="wrap">
                  {selectedCand?.habilidades && selectedCand.habilidades.length > 0 ? (
                    selectedCand.habilidades.map(h => (
                      <Tag key={h} size="md" rounded="full" bg={tagBg} color={tagColor} border="1px solid" borderColor="brand.blue">
                        {h}
                      </Tag>
                    ))
                  ) : (
                    <Text fontSize="xs" color={mutedColor}>Nenhuma habilidade cadastrada.</Text>
                  )}
                </HStack>
              </Box>

              <HStack spacing={4} pt={2}>
                {selectedCand?.linkedin && (
                  <Button as="a" href={selectedCand.linkedin} target="_blank" size="sm" colorScheme="linkedin" leftIcon={<Icon as={FaLinkedin} />}>
                    LinkedIn
                  </Button>
                )}
                {selectedCand?.github && (
                  <Button as="a" href={selectedCand.github} target="_blank" size="sm" variant="outline" leftIcon={<Icon as={FaGithub} />}>
                    GitHub
                  </Button>
                )}
              </HStack>
            </VStack>
          </ModalBody>
          <ModalFooter>
            <Button size="sm" variant="gradient" leftIcon={<Icon as={FaBell} />} onClick={() => { onCloseCand(); abrirNotificacao(selectedCand?.usuarioId, selectedCand?.nome); }}>
              Enviar Notificação
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Container>
  );
}

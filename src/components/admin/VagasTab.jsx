import { useState } from 'react';
import {
  Flex, Heading, Button, Box, Table, Thead, Tbody, Tr, Th, Td, Badge,
  HStack, IconButton, Text, Skeleton, Modal, ModalOverlay, ModalContent,
  ModalHeader, ModalCloseButton, ModalBody, VStack, FormControl, FormLabel,
  Input, ModalFooter, useDisclosure, useToast, useColorModeValue
} from '@chakra-ui/react';
import { FaPlus, FaEdit, FaTrash } from 'react-icons/fa';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { api } from '../../services/api';

export default function VagasTab() {
  const { isOpen: isOpenVaga, onOpen: onOpenVaga, onClose: onCloseVaga } = useDisclosure();
  const toast = useToast();
  const queryClient = useQueryClient();
  const invalidateVacancyData = (affectsApplications = false) => {
    const keys = ['admin_vagas', 'vagas', 'admin_stats'];
    if (affectsApplications) keys.push('candidatos', 'minhas-candidaturas');
    keys.forEach(key => queryClient.invalidateQueries({ queryKey: [key] }));
  };
  
  const headingColor = useColorModeValue('gray.900', 'white');
  const border = useColorModeValue('gray.200', 'whiteAlpha.100');
  const cardBg = useColorModeValue('white', 'brand.cardBg');
  const tableHeaderBg = useColorModeValue('gray.50', 'whiteAlpha.50');
  const tableRowHoverBg = useColorModeValue('gray.50', 'whiteAlpha.50');
  const nameColor = useColorModeValue('gray.800', 'white');
  const mutedColor = useColorModeValue('gray.500', 'gray.400');
  const cancelColor = useColorModeValue('gray.600', 'gray.300');

  const { data: vagas = [], refetch: refetchVagas, isLoading: isLoadingVagas, isError } = useQuery({
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
      let res;
      if (vagaForm.id) {
        res = await api.put(`/api/admin/vagas/${vagaForm.id}`, payload);
      } else {
        res = await api.post('/api/admin/vagas', payload);
      }
      const data = await res.json();
      if (res.ok && data.success) {
        toast({ title: data.message, status: 'success' });
        invalidateVacancyData(Boolean(vagaForm.id));
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
        invalidateVacancyData(true);
      } else {
        const data = await res.json();
        toast({ title: data.message || 'Não foi possível excluir a vaga.', status: 'error' });
      }
    } catch {
      toast({ title: 'Erro ao excluir.', status: 'error' });
    }
  };

  return (
    <>
      <Flex justify="space-between" align="center" mb={6}>
        <Heading size="md" color={headingColor}>Vagas Cadastradas</Heading>
        <Button variant="gradient" leftIcon={<FaPlus />} onClick={() => abrirModalVaga()}>
          Nova Vaga
        </Button>
      </Flex>

      <Box bg={cardBg} border="1px solid" borderColor={border} rounded="lg" overflowX="auto">
        <Table variant="simple" minW="600px">
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
            ) : isError ? (
              <Tr><Td colSpan={4} textAlign="center" py={10}><Text>Não foi possível carregar as vagas.</Text><Button mt={3} onClick={() => refetchVagas()}>Tentar novamente</Button></Td></Tr>
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
    </>
  );
}

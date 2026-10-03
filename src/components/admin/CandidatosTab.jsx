import React, { useState } from 'react';
import {
  Box, HStack, Input, Button, Icon, VStack, Text, Flex, Avatar, Tag,
  Skeleton, SkeletonCircle, useDisclosure, useToast, useColorModeValue,
  Modal, ModalOverlay, ModalContent, ModalHeader, ModalCloseButton,
  ModalBody, Textarea, ModalFooter, Heading, Badge
} from '@chakra-ui/react';
import { FaSearch, FaLinkedin, FaGithub, FaBell } from 'react-icons/fa';
import { useQuery } from '@tanstack/react-query';
import { api } from '../../services/api';

export default function CandidatosTab() {
  const [filtroCargo, setFiltroCargo] = useState('');
  const [filtroHabilidade, setFiltroHabilidade] = useState('');
  const [buscaAtiva, setBuscaAtiva] = useState({ cargo: '', habilidade: '' });

  const [selectedUsuarioId, setSelectedUsuarioId] = useState(null);
  const [selectedNome, setSelectedNome] = useState('');
  const [notifTitulo, setNotifTitulo] = useState('');
  const [notifMensagem, setNotifMensagem] = useState('');
  const [sending, setSending] = useState(false);
  const [selectedCand, setSelectedCand] = useState(null);

  const { isOpen, onOpen, onClose } = useDisclosure();
  const { isOpen: isOpenCand, onOpen: onOpenCand, onClose: onCloseCand } = useDisclosure();
  const toast = useToast();

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

  const { data: candidatos = [], isLoading, isFetching } = useQuery({
    queryKey: ['candidatos', buscaAtiva.cargo, buscaAtiva.habilidade],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (buscaAtiva.cargo) params.append('cargo', buscaAtiva.cargo);
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
    <>
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
                      <Text fontWeight="600" fontSize="sm" color={nameColor}>
                        {c.nome}
                      </Text>
                      <Text fontSize="xs" color={mutedColor} mb={1}>
                        {c.email}
                      </Text>
                      {c.cargo && (
                        <Text fontSize="xs" fontWeight="500" color={cargoColor}>
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
                      {c.vagasCandidatadas && c.vagasCandidatadas.length > 0 && (
                        <Box mt={3}>
                          <Text fontSize="10px" fontWeight="700" textTransform="uppercase" color={mutedColor} mb={1}>Candidaturas ({c.vagasCandidatadas.length})</Text>
                          <HStack spacing={2} flexWrap="wrap">
                            {c.vagasCandidatadas.map((vaga) => (
                              <Tag key={vaga.id} size="sm" rounded="md" colorScheme="green" variant="subtle" fontSize="10px" px={2}>
                                {vaga.titulo}
                              </Tag>
                            ))}
                          </HStack>
                        </Box>
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
    </>
  );
}

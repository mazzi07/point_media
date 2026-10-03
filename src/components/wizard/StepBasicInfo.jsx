import React, { useState } from 'react';
import { VStack, Heading, Box, Text, Input, useColorModeValue, Image, useToast, Spinner, Flex, Icon } from '@chakra-ui/react';
import { FaCloudUploadAlt } from 'react-icons/fa';
import { useAuth } from '../../context/useAuth';
import { api } from '../../services/api';

export default function StepBasicInfo({ user, curriculo, handleChange }) {
  const { updateUserField } = useAuth();
  const toast = useToast();
  const [uploading, setUploading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const headingColor = useColorModeValue('gray.800', 'white');
  const accountBg = useColorModeValue('gray.50', 'gray.700');
  const mutedTextColor = useColorModeValue('gray.400', 'gray.500');
  const accountTextColor = useColorModeValue('gray.700', 'gray.200');
  const uploadBorderColor = useColorModeValue('gray.300', 'gray.600');
  const uploadTextColor = useColorModeValue('gray.600', 'gray.300');

  const processFile = (file) => {
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      toast({ title: 'Apenas imagens são aceitas.', status: 'warning', duration: 3000, position: 'top' });
      return;
    }
    if (file.size > 1024 * 1024) {
      toast({ title: 'A imagem deve ter no máximo 1MB.', status: 'warning', duration: 3000, position: 'top' });
      return;
    }

    setUploading(true);
    const reader = new FileReader();
    reader.onloadend = async () => {
      const base64 = reader.result;
      try {
        const response = await api.post('/api/usuarios/avatar', { avatar: base64 });
        const data = await response.json();
        
        if (response.ok && data.success) {
          updateUserField('avatar', base64);
          toast({ title: 'Foto de perfil atualizada!', status: 'success', duration: 2000, position: 'top' });
        } else {
          toast({ title: 'Erro ao salvar foto.', description: data.message, status: 'error', duration: 3000, position: 'top' });
        }
      } catch {
        toast({ title: 'Erro de conexão.', status: 'error', duration: 3000, position: 'top' });
      } finally {
        setUploading(false);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleFileChange = (e) => {
    processFile(e.target.files[0]);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    const file = e.dataTransfer?.files?.[0];
    processFile(file);
  };

  return (
    <VStack spacing={5} align="stretch">
      <Heading size="sm" color={headingColor}>Dados Básicos</Heading>

      {/* Info do usuário (somente leitura) */}
      <Box p={4} bg={accountBg} rounded="md">
        <Text fontSize="xs" color={mutedTextColor} mb={1}>Conta vinculada</Text>
        <Text fontSize="sm" fontWeight="500" color={accountTextColor}>
          {user?.nome} — {user?.email}
        </Text>
      </Box>

      <Box border="2px dashed" borderColor={isDragging ? 'brand.pink' : uploadBorderColor}
        bg={isDragging ? 'rgba(213, 24, 123, 0.05)' : 'transparent'}
        p={5} rounded="md" textAlign="center" position="relative" overflow="hidden"
        _hover={{ borderColor: 'brand.blue' }} transition="all 0.2s"
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}>
        
        {uploading ? (
          <Spinner size="md" color="brand.blue" />
        ) : isDragging ? (
          <Flex direction="column" align="center" justify="center" py={2}>
            <Icon as={FaCloudUploadAlt} w={8} h={8} color="brand.pink" mb={2} />
            <Text fontSize="sm" fontWeight="600" color="brand.pink">Solte a imagem aqui</Text>
          </Flex>
        ) : user?.avatar ? (
          <Flex direction="column" align="center" justify="center">
            <Image src={user.avatar} boxSize="80px" borderRadius="full" objectFit="cover" mb={2} />
            <Text fontSize="xs" color="brand.blue">Clique ou arraste para alterar a foto</Text>
          </Flex>
        ) : (
          <Box>
            <Icon as={FaCloudUploadAlt} w={6} h={6} color={mutedTextColor} mb={2} />
            <Text fontSize="sm" fontWeight="500" color={uploadTextColor} mb={1}>
              Foto de Perfil
            </Text>
            <Text fontSize="xs" color="gray.400">Arraste ou clique para enviar (máx 1MB)</Text>
          </Box>
        )}
        
        <Input type="file" accept="image/*" opacity={0} position="absolute" h="full" w="full" left={0} top={0} cursor="pointer" onChange={handleFileChange} disabled={uploading} />
      </Box>

      <Input
        placeholder="LinkedIn (ex: linkedin.com/in/seu-perfil)"
        focusBorderColor="brand.blue"
        value={curriculo.linkedin}
        onChange={handleChange('linkedin')}
      />
      <Input
        placeholder="GitHub / Portfólio (ex: github.com/seu-usuario)"
        focusBorderColor="brand.blue"
        value={curriculo.github}
        onChange={handleChange('github')}
      />
    </VStack>
  );
}

import React, { useState } from 'react';
import { VStack, Heading, Box, Text, Input, useColorModeValue, Image, useToast, Spinner, Flex } from '@chakra-ui/react';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../services/api';

export default function StepBasicInfo({ user, curriculo, handleChange }) {
  const { updateUserField } = useAuth();
  const toast = useToast();
  const [uploading, setUploading] = useState(false);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 1024 * 1024) { // 1MB limite
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
  return (
    <VStack spacing={5} align="stretch">
      <Heading size="sm" color={useColorModeValue('gray.800', 'white')}>Dados Básicos</Heading>

      {/* Info do usuário (somente leitura) */}
      <Box p={4} bg={useColorModeValue('gray.50', 'gray.700')} rounded="md">
        <Text fontSize="xs" color={useColorModeValue('gray.400', 'gray.500')} mb={1}>Conta vinculada</Text>
        <Text fontSize="sm" fontWeight="500" color={useColorModeValue('gray.700', 'gray.200')}>
          {user?.nome} — {user?.email}
        </Text>
      </Box>

      <Box border="1px dashed" borderColor={useColorModeValue('gray.300', 'gray.600')}
        p={5} rounded="md" textAlign="center" position="relative" overflow="hidden"
        _hover={{ borderColor: 'brand.blue' }} transition="border-color 0.2s">
        
        {uploading ? (
          <Spinner size="md" color="brand.blue" />
        ) : user?.avatar ? (
          <Flex direction="column" align="center" justify="center">
            <Image src={user.avatar} boxSize="80px" borderRadius="full" objectFit="cover" mb={2} />
            <Text fontSize="xs" color="brand.blue">Clique para alterar a foto</Text>
          </Flex>
        ) : (
          <Box>
            <Text fontSize="sm" fontWeight="500" color={useColorModeValue('gray.600', 'gray.300')} mb={1}>
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

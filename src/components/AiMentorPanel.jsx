import React from 'react';
import { Box, VStack, Heading, Text, Icon, useColorModeValue } from '@chakra-ui/react';
import { FaLightbulb } from 'react-icons/fa';

export default function AiMentorPanel({ currentStep }) {
  const bg = useColorModeValue('gray.50', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');

  const tips = {
    0: { title: 'Dica', text: 'Preencha seus dados básicos com atenção. Um perfil completo tem mais chances de ser encontrado por recrutadores.' },
    1: { title: 'Sobre experiência', text: 'Foque em resultados concretos e responsabilidades. Use verbos de ação como "desenvolvi", "implementei", "otimizei".' },
    2: { title: 'Habilidades', text: 'Adicione as tecnologias e ferramentas que domina. Recrutadores filtram por habilidades específicas.' },
    3: { title: 'Avaliações', text: 'Conclua avaliações técnicas para receber selos de competência. Isso aumenta sua credibilidade.' },
  };

  const content = tips[currentStep] || tips[0];

  return (
    <Box bg={bg} border="1px solid" borderColor={borderColor} rounded="lg" p={5} position="sticky" top="80px">
      <VStack spacing={3} align="flex-start">
        <Icon as={FaLightbulb} w={4} h={4} color="brand.blue" />
        <Heading size="xs" color={useColorModeValue('gray.700', 'gray.200')}>{content.title}</Heading>
        <Text color={useColorModeValue('gray.500', 'gray.400')} fontSize="sm" lineHeight="1.7">{content.text}</Text>
      </VStack>
    </Box>
  );
}

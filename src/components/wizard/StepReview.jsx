import React from 'react';
import {
  VStack, Heading, Box, Text, HStack, Tag, TagLabel, Divider, Icon,
  Avatar, Flex, useColorModeValue
} from '@chakra-ui/react';
import { FaLinkedin, FaGithub, FaBriefcase, FaCode, FaCheckCircle, FaDownload } from 'react-icons/fa';

export default function StepReview({ user, curriculo, habilidades, handleDownloadPDF, isGeneratingPdf }) {
  const cardBg = useColorModeValue('gray.50', 'gray.700');
  const headingColor = useColorModeValue('gray.800', 'white');
  const textColor = useColorModeValue('gray.600', 'gray.300');
  const labelColor = useColorModeValue('gray.400', 'gray.500');
  const tagBg = useColorModeValue('blue.50', 'whiteAlpha.100');
  const tagColor = useColorModeValue('brand.blue', 'white');
  const successColor = useColorModeValue('green.500', 'green.300');

  return (
    <VStack spacing={6} align="stretch">
      <HStack spacing={2}>
        <Icon as={FaCheckCircle} color={successColor} />
        <Heading size="sm" color={headingColor}>Revisão do Currículo</Heading>
      </HStack>
      <Text fontSize="sm" color={textColor}>
        Verifique seus dados abaixo antes de salvar. Clique em "Voltar" para corrigir qualquer informação.
      </Text>

      <Button
        leftIcon={<FaDownload />}
        variant="outline"
        colorScheme="blue"
        size="sm"
        alignSelf="flex-start"
        onClick={handleDownloadPDF}
        isLoading={isGeneratingPdf}
      >
        Pré-visualizar e Baixar Currículo em PDF
      </Button>

      {/* Dados básicos */}
      <Box bg={cardBg} p={5} rounded="lg">
        <Text fontSize="xs" fontWeight="700" textTransform="uppercase" color={labelColor} mb={3}>
          Dados Básicos
        </Text>
        <Flex align="center" gap={4} mb={3}>
          <Avatar size="md" name={user?.nome} src={user?.avatar} bg="brand.blue" color="white" />
          <Box>
            <Text fontWeight="600" color={headingColor}>{user?.nome}</Text>
            <Text fontSize="xs" color={textColor}>{user?.email}</Text>
          </Box>
        </Flex>
        <HStack spacing={4} mt={2} flexWrap="wrap">
          {curriculo.linkedin && (
            <HStack fontSize="xs" color="brand.blue">
              <Icon as={FaLinkedin} />
              <Text>{curriculo.linkedin}</Text>
            </HStack>
          )}
          {curriculo.github && (
            <HStack fontSize="xs" color={textColor}>
              <Icon as={FaGithub} />
              <Text>{curriculo.github}</Text>
            </HStack>
          )}
        </HStack>
        {!curriculo.linkedin && !curriculo.github && (
          <Text fontSize="xs" color={labelColor} fontStyle="italic">Nenhum link social adicionado.</Text>
        )}
      </Box>

      <Divider borderColor={useColorModeValue('gray.200', 'whiteAlpha.100')} />

      {/* Experiência */}
      <Box bg={cardBg} p={5} rounded="lg">
        <Text fontSize="xs" fontWeight="700" textTransform="uppercase" color={labelColor} mb={3}>
          Experiência
        </Text>
        <HStack mb={2}>
          <Icon as={FaBriefcase} color="brand.pink" w={4} h={4} />
          <Text fontWeight="600" fontSize="sm" color={headingColor}>{curriculo.cargo || '—'}</Text>
        </HStack>
        <Text fontSize="sm" color={textColor} whiteSpace="pre-wrap" lineHeight="1.7">
          {curriculo.experiencia || 'Nenhuma experiência informada.'}
        </Text>
      </Box>

      <Divider borderColor={useColorModeValue('gray.200', 'whiteAlpha.100')} />

      {/* Habilidades */}
      <Box bg={cardBg} p={5} rounded="lg">
        <Text fontSize="xs" fontWeight="700" textTransform="uppercase" color={labelColor} mb={3}>
          <Icon as={FaCode} mr={1} />Habilidades ({habilidades.length})
        </Text>
        {habilidades.length > 0 ? (
          <Flex wrap="wrap" gap={2}>
            {habilidades.map((skill) => (
              <Tag key={skill} size="md" rounded="full"
                bg={tagBg} color={tagColor} border="1px solid" borderColor="brand.blue" px={3}>
                <TagLabel fontSize="sm">{skill}</TagLabel>
              </Tag>
            ))}
          </Flex>
        ) : (
          <Text fontSize="xs" color={labelColor} fontStyle="italic">Nenhuma habilidade adicionada.</Text>
        )}
      </Box>
    </VStack>
  );
}

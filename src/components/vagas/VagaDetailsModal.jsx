import React from 'react';
import { Modal, ModalOverlay, ModalContent, ModalHeader, ModalBody, ModalFooter, ModalCloseButton, Button, Tag, Icon, Box, Text, HStack, Heading, useColorModeValue } from '@chakra-ui/react';
import { FaBriefcase } from 'react-icons/fa';


const getTypeColor = (tipo) => {
  if (tipo === 'Remoto') return 'green';
  if (tipo === 'Híbrido') return 'blue';
  return 'orange';
};

export default function VagaDetailsModal({ isOpen, onClose, vaga, isApplied, isApplying, onApply }) {
  const bgCard = useColorModeValue('brand.lightCardBg', 'brand.cardBg');
  const border = useColorModeValue('transparent', 'whiteAlpha.100');
  const headingColor = useColorModeValue('#1B254B', 'white');
  const textColor = useColorModeValue('gray.600', 'gray.400');
  const closeBtnHoverBg = useColorModeValue('gray.50', 'whiteAlpha.100');

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="lg" isCentered>
      <ModalOverlay backdropFilter="blur(4px)" />
      <ModalContent bg={bgCard} border="1px solid" borderColor={border} borderRadius="2xl" mx={4}>
        <ModalHeader pt={6} pb={0}>
          <Heading size="md" color={headingColor}>{vaga?.titulo}</Heading>
        </ModalHeader>
        <ModalCloseButton mt={2} color={textColor} _hover={{ color: headingColor }} />
        <ModalBody py={6}>
          <HStack spacing={4} mb={6} flexWrap="wrap">
            <Tag size="md" bg="rgba(213, 24, 123, 0.1)" color="brand.pink" borderRadius="full" px={4} py={1.5} fontWeight="600">
              <Icon as={FaBriefcase} mr={2} /> Point Media
            </Tag>
            <Tag size="md" colorScheme={vaga ? getTypeColor(vaga.tipoTrabalho) : 'gray'} borderRadius="full" px={4} py={1.5} variant="solid">
              {vaga?.tipoTrabalho}
            </Tag>
          </HStack>

          <Box mb={6}>
            <Text fontSize="sm" fontWeight="600" color={headingColor} mb={2}>Área de Atuação</Text>
            <Text fontSize="sm" color={textColor}>{vaga?.area}</Text>
          </Box>

          <Box mb={6}>
            <Text fontSize="sm" fontWeight="600" color={headingColor} mb={2}>Salário / Remuneração</Text>
            <Text fontSize="sm" color="green.400" fontWeight="600">{vaga?.salario}</Text>
          </Box>

          <Box>
            <Text fontSize="sm" fontWeight="600" color={headingColor} mb={3}>Habilidades Desejadas</Text>
            <HStack spacing={2} flexWrap="wrap">
              {vaga?.habilidades?.map(skill => (
                <Tag key={skill} size="md" bg="rgba(59, 130, 246, 0.1)" color="brand.blue" borderRadius="full" px={4} py={1.5} mb={2}>
                  {skill}
                </Tag>
              ))}
            </HStack>
          </Box>
        </ModalBody>

        <ModalFooter borderTop="1px solid" borderColor={border} pt={5} pb={6}>
          <Button variant="outline" mr={3} onClick={onClose} borderColor={border} color={textColor} _hover={{ bg: closeBtnHoverBg }}>
            Fechar
          </Button>
          {isApplied ? (
            <Button colorScheme="green" flex="1" isDisabled>
              Já Candidatado
            </Button>
          ) : (
            <Button variant="gradient" flex="1" isLoading={isApplying} onClick={onApply}>
              Candidatar-se agora
            </Button>
          )}
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}

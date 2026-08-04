import React from 'react';
import { Box, Container, Flex, Text, HStack, Link, useColorModeValue, Image } from '@chakra-ui/react';
import pointLogo from '../assets/point.png';

export default function Footer() {
  const borderColor = useColorModeValue('gray.200', 'whiteAlpha.100');
  const textColor = useColorModeValue('gray.600', 'gray.400');
  const hoverColor = useColorModeValue('brand.pink', 'white');

  return (
    <Box borderTop="1px solid" borderColor={borderColor} py={8} mt="auto">
      <Container maxW="7xl">
        <Flex 
          direction={{ base: 'column', md: 'row' }} 
          justify="space-between" 
          align="center"
          gap={4}
        >

          <HStack spacing={3} cursor="pointer">
            <Image src={pointLogo} alt="Point Media Logo" w="24px" h="24px" objectFit="contain" />
            <Text fontWeight="600" fontSize="sm" color={useColorModeValue('gray.900', 'white')}>
              Point Media
            </Text>
          </HStack>


          <Text fontSize="xs" color={textColor} textAlign="center">
            &copy; {new Date().getFullYear()} Point Media. Todos os direitos reservados.
          </Text>


          <HStack spacing={6}>
            <Link href="#" fontSize="xs" color={textColor} _hover={{ textDecoration: 'none', color: hoverColor }}>
              Privacidade
            </Link>
            <Link href="#" fontSize="xs" color={textColor} _hover={{ textDecoration: 'none', color: hoverColor }}>
              Termos
            </Link>
            <Link href="#" fontSize="xs" color={textColor} _hover={{ textDecoration: 'none', color: hoverColor }}>
              Contato
            </Link>
          </HStack>
        </Flex>
      </Container>
    </Box>
  );
}

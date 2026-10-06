import { Box, Container, Flex, Text, HStack, Image, Link } from '@chakra-ui/react';
import { Link as RouterLink } from 'react-router-dom';
import pointLogo from '../assets/point.png';

export default function Footer() {
  return (
    <Box as="footer" bg="subtle" borderTop="1px solid" borderColor="border" py={6} mt="auto">
      <Container>
        <Flex direction={{ base: 'column', md: 'row' }} justify="space-between"
          align={{ base: 'flex-start', md: 'center' }} gap={4}>
          <HStack as={RouterLink} to="/" aria-label="Point Media — início" spacing={2}>
            <Image src={pointLogo} alt="" w="24px" h="24px" objectFit="contain" />
            <Text fontWeight="600" fontSize="sm" color="textPrimary">Point Media</Text>
          </HStack>
          <HStack as="nav" aria-label="Navegação do rodapé" spacing={5} fontSize="sm" color="textSecondary">
            <Link as={RouterLink} to="/sobre">Sobre</Link>
            <Link as={RouterLink} to="/vagas">Vagas</Link>
            <Link as={RouterLink} to="/quizzes">Quizzes</Link>
          </HStack>
          <Text fontSize="xs" color="textMuted" maxW="20rem">
            &copy; {new Date().getFullYear()} Point Media. Todos os direitos reservados.
          </Text>
        </Flex>
      </Container>
    </Box>
  );
}

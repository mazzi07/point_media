import { Box, Flex, Tag, Heading, HStack, Text, Icon, Button, useColorModeValue } from '@chakra-ui/react';
import { FaBriefcase, FaReact, FaNodeJs, FaFigma, FaLaptopCode, FaPython, FaPalette, FaChartLine, FaAws } from 'react-icons/fa';

const getIconForSkill = (area, habilidades = []) => {
  const skillList = habilidades.map(h => h.toLowerCase());
  const areaLower = area.toLowerCase();

  if (skillList.includes('react') || skillList.includes('vue.js') || skillList.includes('typescript')) return <Icon as={FaReact} color="white" w={5} h={5} />;
  if (skillList.includes('node.js') || skillList.includes('backend')) return <Icon as={FaNodeJs} color="white" w={5} h={5} />;
  if (skillList.includes('figma') || skillList.includes('illustrator')) return <Icon as={FaFigma} color="white" w={5} h={5} />;
  if (skillList.includes('python')) return <Icon as={FaPython} color="white" w={5} h={5} />;
  if (skillList.includes('aws') || skillList.includes('cloud')) return <Icon as={FaAws} color="white" w={5} h={5} />;
  if (areaLower.includes('design')) return <Icon as={FaPalette} color="white" w={5} h={5} />;
  if (areaLower.includes('marketing') || skillList.includes('seo') || skillList.includes('ads')) return <Icon as={FaChartLine} color="white" w={5} h={5} />;
  
  return <Icon as={FaLaptopCode} color="white" w={5} h={5} />;
};

const getGradientForArea = (area) => {
  const areaLower = area.toLowerCase();
  if (areaLower === 'desenvolvimento') return 'linear-gradient(135deg, #0ea5e9, #3b82f6)';
  if (areaLower === 'design') return 'linear-gradient(135deg, #d946ef, #9333ea)';
  if (areaLower === 'marketing') return 'linear-gradient(135deg, #f43f5e, #be123c)';
  return 'linear-gradient(135deg, #10b981, #059669)';
};

const getTypeColor = (tipo) => {
  if (tipo === 'Remoto') return 'green';
  if (tipo === 'Híbrido') return 'blue';
  return 'orange';
};

export default function VagaCard({ vaga, onOpenModal }) {
  const bgCard = useColorModeValue('brand.lightCardBg', 'brand.cardBg');
  const border = useColorModeValue('transparent', 'whiteAlpha.100');
  const cardShadow = useColorModeValue('0 8px 30px rgba(0,0,0,0.04)', '0 10px 30px rgba(0,0,0,0.4)');
  const hoverShadow = useColorModeValue('0 12px 35px rgba(0,0,0,0.07)', '0 0 20px rgba(213, 24, 123, 0.2)');
  const textColor = useColorModeValue('gray.600', 'gray.400');
  const headingColor = useColorModeValue('#1B254B', 'white');

  return (
    <Box bg={bgCard} p={6} borderRadius="2xl" border="1px solid" borderColor={border} boxShadow={cardShadow} display="flex" flexDirection="column"
      transition="all 0.3s" _hover={{ transform: 'translateY(-4px)', boxShadow: hoverShadow, borderColor: 'brand.pink' }}>
      <Flex justify="space-between" align="flex-start" mb={4}>
        <Flex w={12} h={12} borderRadius="10px" background={getGradientForArea(vaga.area)} align="center" justify="center">
          {getIconForSkill(vaga.area, vaga.habilidades)}
        </Flex>
        <Tag size="sm" colorScheme={getTypeColor(vaga.tipoTrabalho)} borderRadius="full" px={3} opacity={0.9} variant="solid">
          {vaga.tipoTrabalho}
        </Tag>
      </Flex>
      <Heading size="sm" color={headingColor} mb={2}>{vaga.titulo}</Heading>
      <HStack spacing={4} mb={4} color={textColor} fontSize="xs">
        <Text><Icon as={FaBriefcase} mr={1} /> Point Media</Text>
        <Text>{vaga.area}</Text>
      </HStack>
      
      <HStack spacing={2} mb={6} flexWrap="wrap">
        {vaga.habilidades && vaga.habilidades.map(skill => (
          <Tag key={skill} size="sm" bg="transparent" border="1px solid" borderColor={border} color={textColor} borderRadius="full" px={3} mt={1}>
            {skill}
          </Tag>
        ))}
      </HStack>

      <Flex mt="auto" pt={5} borderTop="1px solid" borderColor={border} justify="center" align="center">
        <Button variant="gradient" size="sm" w="full" fontSize="sm" onClick={() => onOpenModal(vaga)}>
          Saiba Mais
        </Button>
      </Flex>
    </Box>
  );
}

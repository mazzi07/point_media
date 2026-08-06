import React, { useMemo } from 'react';
import { VStack, Heading, HStack, Input, Button, Flex, Tag, TagLabel, TagCloseButton, Text, Box, Icon, useColorModeValue } from '@chakra-ui/react';
import { FaPlus } from 'react-icons/fa';

const SKILL_SUGGESTIONS = [
  // Desenvolvimento
  'React', 'Vue.js', 'Angular', 'Next.js', 'Node.js', 'TypeScript', 'JavaScript',
  'Java', 'Spring Boot', 'Python', 'Django', 'PHP', 'Laravel', 'C#', '.NET',
  'Ruby', 'Go', 'Rust', 'Swift', 'Kotlin', 'Flutter', 'React Native',
  // Frontend
  'HTML', 'CSS', 'Sass', 'Tailwind CSS', 'Bootstrap', 'Material UI', 'Chakra UI',
  // Backend & DevOps
  'Docker', 'Kubernetes', 'AWS', 'Azure', 'GCP', 'CI/CD', 'Git', 'Linux',
  'PostgreSQL', 'MySQL', 'MongoDB', 'Redis', 'GraphQL', 'REST API',
  // Design
  'Figma', 'Adobe XD', 'Illustrator', 'Photoshop', 'UX Research', 'UI Design',
  'Design System', 'Prototipação', 'Sketch',
  // Marketing
  'Google Ads', 'Meta Ads', 'SEO', 'Google Analytics', 'Email Marketing',
  'Copywriting', 'Inbound Marketing', 'Social Media', 'Branding',
  // Dados
  'Power BI', 'Tableau', 'Excel Avançado', 'SQL', 'Data Science', 'Machine Learning',
  // Soft Skills
  'Liderança', 'Comunicação', 'Trabalho em Equipe', 'Gestão de Projetos', 'Scrum', 'Kanban',
];

export default function StepSkills({ habilidades, skillInput, setSkillInput, addSkill, removeSkill }) {
  const sugBg = useColorModeValue('gray.50', 'whiteAlpha.50');
  const sugHoverBg = useColorModeValue('gray.100', 'whiteAlpha.100');
  const sugColor = useColorModeValue('gray.600', 'gray.300');
  const labelColor = useColorModeValue('gray.400', 'gray.500');

  // Filter suggestions based on input, excluding already-added skills
  const filteredSuggestions = useMemo(() => {
    const added = new Set(habilidades.map(h => h.toLowerCase()));
    if (!skillInput.trim()) {
      // Show popular picks when input is empty
      return SKILL_SUGGESTIONS.filter(s => !added.has(s.toLowerCase())).slice(0, 12);
    }
    const query = skillInput.toLowerCase();
    return SKILL_SUGGESTIONS
      .filter(s => s.toLowerCase().includes(query) && !added.has(s.toLowerCase()))
      .slice(0, 8);
  }, [skillInput, habilidades]);

  const handleSuggestionClick = (skill) => {
    if (!habilidades.includes(skill)) {
      addSkill({ type: 'click', preventDefault: () => {} }, skill);
    }
  };

  // Enhanced addSkill that accepts an optional skill name override
  const handleAddSkill = (e, overrideSkill) => {
    if (overrideSkill) {
      e.preventDefault();
      if (!habilidades.includes(overrideSkill)) {
        // We call the parent addSkill with a synthetic event
        const syntheticEvent = { key: 'Enter', preventDefault: () => {} };
        setSkillInput(overrideSkill);
        // Use timeout to let state update, then trigger
        setTimeout(() => {
          addSkill(syntheticEvent);
        }, 0);
      }
      return;
    }
    addSkill(e);
  };

  return (
    <VStack spacing={5} align="stretch">
      <Heading size="sm" color={useColorModeValue('gray.800', 'white')}>Habilidades Técnicas</Heading>
      <HStack>
        <Input
          placeholder="Ex: React, Java, Figma (Enter para adicionar)"
          focusBorderColor="brand.blue"
          value={skillInput}
          onChange={(e) => setSkillInput(e.target.value)}
          onKeyDown={addSkill}
        />
        <Button variant="gradient" onClick={addSkill} px={6} data-skill-add-btn>
          Adicionar
        </Button>
      </HStack>

      {/* Autocomplete suggestions */}
      {filteredSuggestions.length > 0 && (
        <Box>
          <Text fontSize="xs" color={labelColor} mb={2}>
            {skillInput.trim() ? 'Sugestões:' : 'Populares:'}
          </Text>
          <Flex wrap="wrap" gap={2}>
            {filteredSuggestions.map((suggestion) => (
              <Tag
                key={suggestion}
                size="sm"
                rounded="full"
                bg={sugBg}
                color={sugColor}
                cursor="pointer"
                transition="all 0.15s"
                _hover={{ bg: sugHoverBg, color: 'brand.blue', borderColor: 'brand.blue' }}
                border="1px dashed"
                borderColor={useColorModeValue('gray.300', 'gray.600')}
                px={3}
                py={1}
                onClick={() => {
                  setSkillInput(suggestion);
                  // Simulate click add
                  setTimeout(() => {
                    const btn = document.querySelector('[data-skill-add-btn]');
                    if (btn) btn.click();
                  }, 10);
                }}
              >
                <Icon as={FaPlus} w={2} h={2} mr={1} />
                <TagLabel fontSize="xs">{suggestion}</TagLabel>
              </Tag>
            ))}
          </Flex>
        </Box>
      )}

      {/* Added skills */}
      <Box>
        {habilidades.length > 0 && (
          <Text fontSize="xs" color={labelColor} mb={2}>
            Suas habilidades ({habilidades.length}):
          </Text>
        )}
        <Flex wrap="wrap" gap={2} minH="40px">
          {habilidades.map((skill) => (
            <Tag key={skill} size="md" rounded="full"
              bg={useColorModeValue('blue.50', 'whiteAlpha.100')} color={useColorModeValue('brand.blue', 'white')} border="1px solid" borderColor="brand.blue" px={3}>
              <TagLabel fontSize="sm">{skill}</TagLabel>
              <TagCloseButton onClick={() => removeSkill(skill)} />
            </Tag>
          ))}
        </Flex>
      </Box>
    </VStack>
  );
}


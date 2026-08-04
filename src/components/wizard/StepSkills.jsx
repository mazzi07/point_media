import React from 'react';
import { VStack, Heading, HStack, Input, Button, Flex, Tag, TagLabel, TagCloseButton, useColorModeValue } from '@chakra-ui/react';

export default function StepSkills({ habilidades, skillInput, setSkillInput, addSkill, removeSkill }) {
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
        <Button variant="gradient" onClick={addSkill} px={6}>
          Adicionar
        </Button>
      </HStack>
      <Flex wrap="wrap" gap={2} minH="40px">
        {habilidades.map((skill) => (
          <Tag key={skill} size="md" rounded="full"
            bg={useColorModeValue('blue.50', 'whiteAlpha.100')} color={useColorModeValue('brand.blue', 'white')} border="1px solid" borderColor="brand.blue" px={3}>
            <TagLabel fontSize="sm">{skill}</TagLabel>
            <TagCloseButton onClick={() => removeSkill(skill)} />
          </Tag>
        ))}
      </Flex>
    </VStack>
  );
}

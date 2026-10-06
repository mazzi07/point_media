import { VStack, Heading, Input, Textarea, useColorModeValue } from '@chakra-ui/react';

export default function StepExperience({ curriculo, handleChange }) {
  return (
    <VStack spacing={5} align="stretch">
      <Heading size="sm" color={useColorModeValue('gray.800', 'white')}>Experiência e Formação</Heading>
      <Input
        placeholder="Cargo atual ou objetivo profissional"
        focusBorderColor="brand.blue"
        value={curriculo.cargo}
        onChange={handleChange('cargo')}
      />
      <Textarea
        placeholder="Descreva suas experiências, responsabilidades e conquistas profissionais."
        rows={6}
        focusBorderColor="brand.blue"
        value={curriculo.experiencia}
        onChange={handleChange('experiencia')}
      />
    </VStack>
  );
}

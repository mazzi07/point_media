import React, { useState, useEffect } from 'react';
import {
  Box, Flex, Grid, GridItem, Heading, Text, Button, HStack,
  useColorModeValue, Icon, useToast, Container, Spinner,
  AlertDialog, AlertDialogOverlay, AlertDialogContent, AlertDialogHeader, AlertDialogBody, AlertDialogFooter
} from '@chakra-ui/react';
import { FaCheck } from 'react-icons/fa';
import AiMentorPanel from './AiMentorPanel';
import { api } from '../services/api';
import { useAuth } from '../context/useAuth';
import { useNavigate } from 'react-router-dom';

import StepBasicInfo from './wizard/StepBasicInfo';
import StepExperience from './wizard/StepExperience';
import StepSkills from './wizard/StepSkills';
import StepReview from './wizard/StepReview';
import ResumePDFTemplate from './ResumePDFTemplate';
import { generateResumePdf } from '../utils/resumePdf';

export default function ResumeWizard() {
  const [currentStep, setCurrentStep] = useState(0);
  const steps = ['Dados Básicos', 'Experiência', 'Habilidades', 'Revisão'];

  const toast = useToast();
  const { user, setHasResume } = useAuth();


  const [curriculo, setCurriculo] = useState({
    cargo: '',
    experiencia: '',
    linkedin: '',
    github: '',
  });
  const [habilidades, setHabilidades] = useState([]);
  const [skillInput, setSkillInput] = useState('');

  const [loadingData, setLoadingData] = useState(true);
  const [loadError, setLoadError] = useState(false);
  const [loadAttempt, setLoadAttempt] = useState(0);
  const [saving, setSaving] = useState(false);


  useEffect(() => {
    let active = true;
    api.get('/api/curriculo')
      .then(async (res) => {
        if (res.status === 404) return;
        if (!res.ok) throw new Error('Falha ao carregar currículo');
        const data = await res.json();
        if (!active) return;
        setCurriculo({
          cargo: data.cargo || '',
          experiencia: data.experiencia || '',
          linkedin: data.linkedin || '',
          github: data.github || '',
        });
        setHabilidades(data.habilidades || []);
      })
      .catch(() => { if (active) setLoadError(true); })
      .finally(() => { if (active) setLoadingData(false); });
    return () => { active = false; };
  }, [loadAttempt]);

  const retryLoad = () => {
    setLoadError(false);
    setLoadingData(true);
    setLoadAttempt(prev => prev + 1);
  };

  const handleChange = (field) => (e) =>
    setCurriculo((prev) => ({ ...prev, [field]: e.target.value }));

  const handleNextStep = () => {
    if (currentStep === 0) {
      if (!user?.hasCurriculo && (!curriculo.linkedin.trim() || !curriculo.github.trim())) {
        setIsAlertOpen(true);
        return;
      }
    }

    if (currentStep === 1) {
      if (!curriculo.cargo.trim() || !curriculo.experiencia.trim()) {
        toast({ title: 'Campos Obrigatórios', description: 'Por favor, preencha Cargo e Experiência.', status: 'warning', duration: 4000, position: 'top' });
        return;
      }
    }

    if (currentStep === 2 && habilidades.length === 0) {
      toast({ title: 'Habilidades', description: 'Adicione pelo menos uma habilidade.', status: 'warning', duration: 4000, position: 'top' });
      return;
    }

    setCurrentStep((prev) => Math.min(prev + 1, steps.length - 1));
  };

  const prevStep = () => setCurrentStep((prev) => Math.max(prev - 1, 0));

  const addSkill = (value) => {
    const skill = value?.trim();
    if (!skill) return;

    if (!habilidades.includes(skill)) {
      setHabilidades((prev) => [...prev, skill]);
    }
    setSkillInput('');
  };

  const removeSkill = (s) => setHabilidades((prev) => prev.filter((h) => h !== s));

  const [isAlertOpen, setIsAlertOpen] = useState(false);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const cancelRef = React.useRef();
  const navigate = useNavigate();

  const validateAndSave = () => {
    if (!curriculo.cargo.trim() || !curriculo.experiencia.trim() || habilidades.length === 0) {
      toast({
        title: 'Campos Incompletos',
        description: 'Você precisa preencher Cargo, Experiência e Habilidades antes de salvar.',
        status: 'error',
        duration: 4000,
        position: 'top',
        isClosable: true
      });
      return;
    }
    handleSave();
  };

  const handleSave = async () => {
    if (loadingData || loadError) return;
    setSaving(true);
    try {
      const response = await api.post('/api/curriculo', {
        ...curriculo,
        habilidades,
      });
      const data = await response.json();

      if (response.ok && data.success) {
        setHasResume(true);
        setIsSuccessModalOpen(true);
      } else {
        toast({
          title: 'Erro ao salvar',
          description: data.message || 'Tente novamente.',
          status: 'error',
          duration: 4000,
          isClosable: true,
          position: 'top',
        });
      }
    } catch {
      toast({
        title: 'Erro de conexão',
        description: 'Servidor indisponível.',
        status: 'error',
        duration: 4000,
        isClosable: true,
        position: 'top',
      });
    } finally {
      setSaving(false);
    }
  };

  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);

  const handleDownloadPDF = () => {
    setIsGeneratingPdf(true);
    setTimeout(async () => {
      try {
        const element = document.getElementById('wizard-pdf-template');
        if (!element) throw new Error('Modelo de PDF indisponível');
        const filename = `curriculo_${user?.nome.replace(/\s+/g, '_').toLowerCase()}.pdf`;
        await generateResumePdf(element, filename);
      } catch {
        toast({ title: 'Não foi possível gerar o PDF.', description: 'Tente novamente.', status: 'error', isClosable: true });
      } finally {
        setIsGeneratingPdf(false);
      }
    }, 100);
  };

  const borderColor = useColorModeValue('gray.200', 'whiteAlpha.100');
  const cardBg = useColorModeValue('white', 'brand.cardBg');
  const headingColor = useColorModeValue('gray.900', 'white');
  const mutedTextColor = useColorModeValue('gray.500', 'gray.400');
  const stepLineBg = useColorModeValue('gray.200', 'gray.700');
  const inactiveStepBg = useColorModeValue('gray.200', 'whiteAlpha.200');
  const inactiveStepColor = useColorModeValue('gray.400', 'gray.500');
  const activeStepLabelColor = useColorModeValue('gray.800', 'white');
  const dialogTextColor = useColorModeValue('gray.600', 'gray.300');

  if (loadError) {
    return (
      <Flex minH="60vh" align="center" justify="center" direction="column" gap={4}>
        <Text>Não foi possível carregar seu currículo. Seus dados não foram alterados.</Text>
        <Button onClick={retryLoad}>Tentar novamente</Button>
      </Flex>
    );
  }

  if (loadingData) {
    return (
      <Flex minH="60vh" align="center" justify="center">
        <Spinner size="lg" color="brand.blue" />
      </Flex>
    );
  }

  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return <StepBasicInfo user={user} curriculo={curriculo} handleChange={handleChange} />;
      case 1:
        return <StepExperience curriculo={curriculo} handleChange={handleChange} />;
      case 2:
        return <StepSkills habilidades={habilidades} skillInput={skillInput} setSkillInput={setSkillInput} addSkill={addSkill} removeSkill={removeSkill} />;
      case 3:
        return <StepReview user={user} curriculo={curriculo} habilidades={habilidades} 
                 handleDownloadPDF={handleDownloadPDF} isGeneratingPdf={isGeneratingPdf} />;
      default:
        return null;
    }
  };

  return (
    <Container maxW="6xl" py={12}>

      <Box mb={10}>
        <Text fontSize="xs" fontWeight="600" textTransform="uppercase" letterSpacing="0.1em" color="brand.blue" mb={2}>
          Currículo
        </Text>
        <Heading size="lg" color={headingColor} mb={1}>
          {user?.nome || 'Seu perfil'}
        </Heading>
        <Text color={mutedTextColor} fontSize="sm">
          Preencha as etapas abaixo. Suas informações são salvas ao finalizar.
        </Text>
      </Box>


      <HStack spacing={0} mb={10} w="full">
        {steps.map((label, idx) => {
          const isActive    = idx === currentStep;
          const isCompleted = idx < currentStep;
          const activeLine  = isCompleted || isActive;

          return (
            <Flex key={label} flex={1} direction="column" align="center" position="relative">
              {idx > 0 && (
                <Box position="absolute" top="12px" left={0} right="50%" h="2px"
                  bg={activeLine ? 'brand.pink' : stepLineBg} />
              )}
              {idx < steps.length - 1 && (
                <Box position="absolute" top="12px" left="50%" right={0} h="2px"
                  bg={isCompleted ? 'brand.pink' : stepLineBg} />
              )}
              <Flex
                w={6} h={6} align="center" justify="center" borderRadius="full" zIndex={1} mb={2}
                bg={isActive || isCompleted ? 'brand.pink' : inactiveStepBg}
                color={isActive || isCompleted ? 'white' : inactiveStepColor}
                fontSize="xs" fontWeight="600"
              >
                {isCompleted ? <Icon as={FaCheck} w={3} h={3} /> : idx + 1}
              </Flex>
              <Text
                fontSize="xs"
                fontWeight={isActive ? '600' : '400'}
                color={isActive ? activeStepLabelColor : inactiveStepColor}
                textAlign="center"
              >
                {label}
              </Text>
            </Flex>
          );
        })}
      </HStack>


      <Grid templateColumns={{ base: '1fr', lg: '7fr 3fr' }} gap={8}>
        <GridItem>
          <Box bg={cardBg} p={{ base: 6, md: 8 }} rounded="lg" border="1px solid" borderColor={borderColor}>
            

            {renderStepContent()}


            <Flex mt={8} justify="space-between" pt={5} borderTop="1px solid" borderColor={borderColor}>
              <Button onClick={prevStep} isDisabled={currentStep === 0} variant="ghost" size="sm"
                fontWeight="400" color={mutedTextColor}>
                Voltar
              </Button>
              {currentStep < steps.length - 1 ? (
                <Button onClick={handleNextStep} variant="gradient" size="sm" px={6}>
                  Continuar
                </Button>
              ) : (
                <Button onClick={validateAndSave} variant="gradient" size="sm" px={6}
                  isLoading={saving} loadingText="Salvando...">
                  Finalizar e Salvar
                </Button>
              )}
            </Flex>
          </Box>
        </GridItem>


        <GridItem display={{ base: 'none', lg: 'block' }}>
          <AiMentorPanel currentStep={currentStep} />
        </GridItem>
      </Grid>


      <AlertDialog
        isOpen={isAlertOpen}
        leastDestructiveRef={cancelRef}
        onClose={() => setIsAlertOpen(false)}
        isCentered
      >
        <AlertDialogOverlay backdropFilter="blur(4px)" />
        <AlertDialogContent bg={cardBg} border="1px solid" borderColor={borderColor}>
          <AlertDialogHeader fontSize="lg" fontWeight="bold" color={headingColor}>
            Campos Opcionais em Branco
          </AlertDialogHeader>

          <AlertDialogBody color={dialogTextColor}>
            Você não preencheu o <strong>LinkedIn</strong> e/ou <strong>GitHub</strong>. 
            Isso pode diminuir suas chances de destaque entre os recrutadores. Tem certeza de que deseja continuar sem eles?
          </AlertDialogBody>

          <AlertDialogFooter>
            <Button ref={cancelRef} onClick={() => setIsAlertOpen(false)} variant="ghost" color={dialogTextColor}>
              Voltar e Preencher
            </Button>
            <Button variant="gradient" onClick={() => { setIsAlertOpen(false); setCurrentStep(1); }} ml={3}>
              Continuar Mesmo Assim
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>


      <AlertDialog
        isOpen={isSuccessModalOpen}
        leastDestructiveRef={cancelRef}
        onClose={() => { setIsSuccessModalOpen(false); navigate('/'); }}
        isCentered
      >
        <AlertDialogOverlay backdropFilter="blur(4px)" />
        <AlertDialogContent bg={cardBg} border="1px solid" borderColor={borderColor}>
          <AlertDialogHeader fontSize="lg" fontWeight="bold" color={headingColor}>
            🎉 Currículo Salvo com Sucesso!
          </AlertDialogHeader>

          <AlertDialogBody color={dialogTextColor}>
            Seu currículo foi atualizado e agora você está visível para oportunidades.
            <br/><br/>
            <strong>Deseja colocar seu conhecimento em prática agora mesmo?</strong>
            <br/>
            Responda nossos quizzes técnicos, suba no Ranking de Candidatos e ganhe badges exclusivas no seu perfil para impressionar recrutadores!
            <br/>
            <Text fontSize="sm" mt={2} color="gray.500">(Você também pode fazer isso mais tarde na aba Quizzes do menu).</Text>
          </AlertDialogBody>

          <AlertDialogFooter>
            <Button ref={cancelRef} onClick={() => { setIsSuccessModalOpen(false); navigate('/'); }} variant="ghost" color={dialogTextColor}>
              Voltar ao Início
            </Button>
            <Button variant="gradient" onClick={() => { setIsSuccessModalOpen(false); navigate('/quizzes'); }} ml={3}>
              Fazer Quizzes Agora
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Hidden PDF template for downloading */}
      <div style={{ position: 'absolute', top: '-9999px', left: '-9999px' }}>
        <div id="wizard-pdf-template">
          <ResumePDFTemplate user={user} curriculo={curriculo} habilidades={habilidades} />
        </div>
      </div>
    </Container>
  );
}

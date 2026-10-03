import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Box, Container, Heading, Text, Flex, Button, useColorModeValue, Progress, VStack, HStack, Grid, RadioGroup, Radio, useToast, CircularProgress, CircularProgressLabel, Icon } from '@chakra-ui/react';
import { useParams, useNavigate } from 'react-router-dom';
import { api } from '../services/api';
import { FaClock, FaCheckCircle, FaTimesCircle, FaStar, FaTrophy } from 'react-icons/fa';

export default function QuizTest() {
  const { id } = useParams();
  const navigate = useNavigate();
  const toast = useToast();

  const [quiz, setQuiz] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [respostas, setRespostas] = useState({});
  const [timeLeft, setTimeLeft] = useState(0);
  const [finished, setFinished] = useState(false);
  const [result, setResult] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const submissionLocked = useRef(false);
  const timeoutHandled = useRef(false);

  const bgCard = useColorModeValue('white', 'brand.cardBg');
  const border = useColorModeValue('gray.200', 'whiteAlpha.100');
  const textColor = useColorModeValue('gray.600', 'gray.400');
  const headingColor = useColorModeValue('gray.900', 'white');
  const progressBg = useColorModeValue('gray.100', 'whiteAlpha.100');

  useEffect(() => {
    api.get(`/api/quizzes/${id}`)
      .then(res => {
        if (!res.ok) throw new Error();
        return res.json();
      })
      .then(data => {
        if (data.isRespondido) {
          toast({ title: 'Quiz já realizado.', description: 'Você não pode refazer este teste.', status: 'warning' });
          navigate('/quizzes');
          return;
        }
        setQuiz(data);
        setTimeLeft(data.tempoMinutos * 60);
        setLoading(false);
      })
      .catch(() => {
        toast({ title: 'Quiz não encontrado.', status: 'error' });
        navigate('/quizzes');
      });
  }, [id, navigate, toast]);

  // timer do quiz
  const timerRunning = !loading && !finished && timeLeft > 0;
  useEffect(() => {
    if (!timerRunning) return;
    const timer = setInterval(() => setTimeLeft(prev => Math.max(0, prev - 1)), 1000);
    return () => clearInterval(timer);
  }, [timerRunning]);

  const handleNext = () => {
    if (currentQuestion < quiz.perguntas.length - 1) {
      setCurrentQuestion(prev => prev + 1);
    }
  };

  const handlePrev = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(prev => prev - 1);
    }
  };

  const handleFinalizar = useCallback(async (timeOut = false) => {
    if (!quiz || submissionLocked.current) return;

    if (!timeOut && Object.keys(respostas).length < quiz.perguntas.length) {
      toast({ title: 'Atenção', description: 'Responda todas as perguntas antes de finalizar.', status: 'warning' });
      return;
    }

    submissionLocked.current = true;
    setSubmitting(true);
    const tempoGasto = (quiz.tempoMinutos * 60) - timeLeft;
    let completed = false;

    try {
      const response = await api.post(`/api/quizzes/${id}/responder`, {
        respostas,
        tempoGasto
      });
      const data = await response.json();
      
      if (response.ok && data.success) {
        completed = true;
        setResult(data);
        setFinished(true);
      } else {
        toast({ title: 'Erro ao enviar.', description: data.message, status: 'error' });
      }
    } catch {
      toast({ title: 'Erro de conexão.', status: 'error' });
    } finally {
      // Libera uma nova tentativa manual apenas se o envio falhar.
      submissionLocked.current = completed;
      setSubmitting(false);
    }
  }, [quiz, respostas, timeLeft, id, toast]);

  // Trata o fim do tempo uma vez, mesmo se respostas ou o envio mudarem.
  useEffect(() => {
    if (timeLeft === 0 && !loading && !finished && !timeoutHandled.current) {
      timeoutHandled.current = true;
      handleFinalizar(true);
    }
  }, [timeLeft, loading, finished, handleFinalizar]);

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60).toString().padStart(2, '0');
    const s = (seconds % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  if (loading) return <Flex justify="center" pt={32}><CircularProgress isIndeterminate color="brand.pink" /></Flex>;

  if (finished && result) {
    const pct = Math.round((result.acertos / result.total) * 100);
    return (
      <Container maxW="3xl" pt={24} pb={20}>
        <Box bg={bgCard} p={10} borderRadius="2xl" border="1px solid" borderColor={border} textAlign="center">
          <Icon as={pct >= 70 ? FaTrophy : FaCheckCircle} w={20} h={20} color={pct >= 70 ? 'yellow.400' : 'brand.pink'} mb={6} />
          <Heading size="xl" color={headingColor} mb={2}>Quiz Finalizado!</Heading>
          <Text color={textColor} mb={8}>Seu resultado no teste {quiz.titulo}</Text>

          <Flex justify="center" gap={8} mb={10} flexWrap="wrap">
            <Box>
              <CircularProgress value={pct} color="brand.blue" size="120px" thickness="8px">
                <CircularProgressLabel color={headingColor} fontWeight="bold">{pct}%</CircularProgressLabel>
              </CircularProgress>
              <Text mt={2} color={textColor} fontSize="sm">Acertos</Text>
            </Box>
            
            <VStack justify="center" align="flex-start" spacing={4}>
              <HStack>
                <Icon as={FaStar} color="yellow.400" />
                <Text color={headingColor} fontWeight="bold">{result.nota} pontos ganhos</Text>
              </HStack>
              <HStack>
                <Icon as={FaCheckCircle} color="green.400" />
                <Text color={headingColor} fontWeight="bold">{result.acertos} de {result.total} corretas</Text>
              </HStack>
            </VStack>
          </Flex>

          <Button variant="gradient" size="lg" px={10} onClick={() => navigate('/quizzes')}>
            Voltar para o Ranking
          </Button>
        </Box>
      </Container>
    );
  }

  const perguntaAtual = quiz.perguntas[currentQuestion];
  const progresso = ((currentQuestion + 1) / quiz.perguntas.length) * 100;

  return (
    <Container maxW="4xl" pt={16} pb={20}>

      <Box mb={8}>
        <Heading size="lg" color={headingColor} mb={2}>{quiz.titulo}</Heading>
        <Flex justify="space-between" align="center" flexWrap="wrap" gap={4}>
          <Text color={textColor} fontSize="sm">{quiz.categoria} • {quiz.nivel}</Text>
          <Flex align="center" bg={timeLeft < 60 ? 'red.500' : 'rgba(213, 24, 123, 0.1)'} 
                color={timeLeft < 60 ? 'white' : 'brand.pink'} px={4} py={2} borderRadius="full" fontWeight="bold">
            <Icon as={FaClock} mr={2} />
            {formatTime(timeLeft)}
          </Flex>
        </Flex>
      </Box>

      <Grid templateColumns={{ base: '1fr', lg: '7fr 3fr' }} gap={8}>
        {/* pergunta atual */}
        <Box bg={bgCard} p={8} borderRadius="2xl" border="1px solid" borderColor={border}>
          <Flex justify="space-between" align="center" mb={6}>
            <Text color={textColor} fontWeight="600">Questão {currentQuestion + 1} de {quiz.perguntas.length}</Text>
          </Flex>
          <Progress value={progresso} size="sm" colorScheme="pink" borderRadius="full" bg={progressBg} mb={8} />

          <Heading size="md" color={headingColor} mb={8} lineHeight="tall">
            {perguntaAtual.texto}
          </Heading>

          <RadioGroup 
            onChange={(val) => setRespostas(prev => ({ ...prev, [perguntaAtual.id]: val }))} 
            value={respostas[perguntaAtual.id] || ''}
          >
            <VStack align="stretch" spacing={4}>
              {perguntaAtual.alternativas.map((alt) => {
                const isSelected = respostas[perguntaAtual.id] === String(alt.id);
                return (
                  <Box 
                    key={alt.id} 
                    as="label" 
                    p={4} 
                    border="1px solid" 
                    borderColor={isSelected ? 'brand.pink' : border} 
                    bg={isSelected ? 'rgba(213, 24, 123, 0.05)' : 'transparent'}
                    borderRadius="lg" 
                    cursor="pointer"
                    _hover={{ borderColor: 'brand.pink' }}
                    transition="all 0.2s"
                  >
                    <Radio value={String(alt.id)} colorScheme="pink" size="lg" display="none" />
                    <Flex align="center">
                      <Box w={5} h={5} borderRadius="full" border="2px solid" borderColor={isSelected ? 'brand.pink' : textColor} display="flex" alignItems="center" justify="center" mr={4}>
                        {isSelected && <Box w={2.5} h={2.5} borderRadius="full" bg="brand.pink" />}
                      </Box>
                      <Text color={headingColor} fontWeight={isSelected ? '600' : '400'}>{alt.texto}</Text>
                    </Flex>
                  </Box>
                );
              })}
            </VStack>
          </RadioGroup>

          <Flex justify="space-between" mt={10} pt={6} borderTop="1px solid" borderColor={border}>
            <Button variant="ghost" color={textColor} onClick={handlePrev} isDisabled={currentQuestion === 0}>
              Anterior
            </Button>
            
            {currentQuestion < quiz.perguntas.length - 1 ? (
              <Button variant="gradient" onClick={handleNext} isDisabled={!respostas[perguntaAtual.id]}>
                Próxima questão
              </Button>
            ) : (
              <Button variant="gradient" onClick={() => handleFinalizar(false)} isLoading={submitting} isDisabled={Object.keys(respostas).length < quiz.perguntas.length}>
                Finalizar Teste
              </Button>
            )}
          </Flex>
        </Box>

        {/* navegacao rapida das questoes */}
        <Box bg={bgCard} p={6} borderRadius="2xl" border="1px solid" borderColor={border} alignSelf="start" display={{ base: 'none', lg: 'block' }}>
          <Text fontWeight="600" color={headingColor} mb={4}>Navegação</Text>
          <Grid templateColumns="repeat(4, 1fr)" gap={2}>
            {quiz.perguntas.map((p, idx) => {
              const answered = !!respostas[p.id];
              const isCurrent = idx === currentQuestion;
              return (
                <Flex 
                  key={p.id} 
                  w="100%" 
                  aspectRatio="1" 
                  align="center" 
                  justify="center" 
                  borderRadius="md" 
                  fontWeight="bold"
                  fontSize="sm"
                  cursor="pointer"
                  onClick={() => setCurrentQuestion(idx)}
                  bg={isCurrent ? 'brand.pink' : answered ? 'rgba(16, 185, 129, 0.2)' : 'transparent'}
                  color={isCurrent ? 'white' : answered ? 'green.400' : textColor}
                  border="1px solid"
                  borderColor={isCurrent ? 'brand.pink' : answered ? 'green.400' : border}
                >
                  {idx + 1}
                </Flex>
              );
            })}
          </Grid>
          
          <Box mt={8} p={4} bg="rgba(236, 201, 75, 0.1)" borderRadius="lg">
            <HStack color="yellow.400" mb={2}>
              <Icon as={FaStar} />
              <Text fontWeight="bold" fontSize="sm">Dica</Text>
            </HStack>
            <Text fontSize="xs" color={textColor}>
              Leia com atenção. Você não pode pausar o timer depois de iniciar o quiz. Boa sorte!
            </Text>
          </Box>
        </Box>
      </Grid>
    </Container>
  );
}

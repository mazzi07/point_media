package com.pointmedia.auth.controller;

import com.pointmedia.auth.model.*;
import com.pointmedia.auth.repository.QuizRepository;
import com.pointmedia.auth.repository.ResultadoQuizRepository;
import com.pointmedia.auth.repository.UsuarioRepository;
import org.hibernate.exception.ConstraintViolationException;
import org.springframework.dao.DataAccessException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.authentication.AnonymousAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.transaction.annotation.Transactional;

@RestController
@RequestMapping("/api/quizzes")
@Transactional
public class QuizController {

    private static final Logger logger = LoggerFactory.getLogger(QuizController.class);

    private final QuizRepository quizRepository;
    private final ResultadoQuizRepository resultadoQuizRepository;
    private final UsuarioRepository usuarioRepository;

    public QuizController(QuizRepository quizRepository, ResultadoQuizRepository resultadoQuizRepository, UsuarioRepository usuarioRepository) {
        this.quizRepository = quizRepository;
        this.resultadoQuizRepository = resultadoQuizRepository;
        this.usuarioRepository = usuarioRepository;
    }

    private Optional<Usuario> getAuthenticatedUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated()
                || authentication instanceof AnonymousAuthenticationToken) {
            return Optional.empty();
        }
        return usuarioRepository.findByEmail(authentication.getName());
    }

    @GetMapping
    public ResponseEntity<?> listarQuizzes() {
        Optional<Usuario> usuarioOpt = getAuthenticatedUser();
        List<Quiz> quizzes = quizRepository.findAll();
        // retorna sem as alternativas completas pra nao pesar
        List<Map<String, Object>> res = quizzes.stream().map(q -> {
            Map<String, Object> map = new HashMap<>();
            map.put("id", q.getId());
            map.put("titulo", q.getTitulo());
            map.put("descricao", q.getDescricao());
            map.put("categoria", q.getCategoria());
            map.put("nivel", q.getNivel());
            map.put("tempoMinutos", q.getTempoMinutos());
            map.put("totalPerguntas", q.getPerguntas().size());
            
            boolean isRespondido = false;
            if (usuarioOpt.isPresent()) {
                isRespondido = resultadoQuizRepository.findByUsuarioAndQuiz(usuarioOpt.get(), q).isPresent();
            }
            map.put("isRespondido", isRespondido);
            
            return map;
        }).collect(Collectors.toList());
        return ResponseEntity.ok(res);
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getQuizCompleto(@PathVariable Long id) {
        Optional<Usuario> usuarioOpt = getAuthenticatedUser();
        Optional<Quiz> quizOpt = quizRepository.findById(id);
        if (quizOpt.isEmpty()) return ResponseEntity.notFound().build();
        Quiz quiz = quizOpt.get();
        quiz.getPerguntas().size(); // force init
        for(Pergunta p : quiz.getPerguntas()) {
            p.getAlternativas().size(); // force init
        }

        Map<String, Object> quizMap = new HashMap<>();
        quizMap.put("id", quiz.getId());
        quizMap.put("titulo", quiz.getTitulo());
        quizMap.put("descricao", quiz.getDescricao());
        quizMap.put("categoria", quiz.getCategoria());
        quizMap.put("nivel", quiz.getNivel());
        quizMap.put("tempoMinutos", quiz.getTempoMinutos());
        
        boolean isRespondido = false;
        if (usuarioOpt.isPresent()) {
            isRespondido = resultadoQuizRepository.findByUsuarioAndQuiz(usuarioOpt.get(), quiz).isPresent();
        }
        quizMap.put("isRespondido", isRespondido);

        // Envia só id e texto das alternativas; o gabarito fica no servidor.
        List<Map<String, Object>> perguntas = new ArrayList<>();
        for (Pergunta pergunta : quiz.getPerguntas()) {
            Map<String, Object> perguntaDados = new HashMap<>();
            perguntaDados.put("id", pergunta.getId());
            perguntaDados.put("texto", pergunta.getTexto());

            List<Map<String, Object>> alternativas = new ArrayList<>();
            for (Alternativa alternativa : pergunta.getAlternativas()) {
                Map<String, Object> alternativaDados = new HashMap<>();
                alternativaDados.put("id", alternativa.getId());
                alternativaDados.put("texto", alternativa.getTexto());
                alternativas.add(alternativaDados);
            }
            perguntaDados.put("alternativas", alternativas);
            perguntas.add(perguntaDados);
        }
        quizMap.put("perguntas", perguntas);

        return ResponseEntity.ok(quizMap);
    }

    @PostMapping("/{id}/responder")
    public ResponseEntity<?> responderQuiz(@PathVariable Long id, @RequestBody Map<String, Object> body) {
        Optional<Usuario> usuarioOpt = getAuthenticatedUser();
        if (usuarioOpt.isEmpty()) return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();

        Optional<Quiz> quizOpt = quizRepository.findById(id);
        if (quizOpt.isEmpty()) return ResponseEntity.notFound().build();

        Usuario usuario = usuarioOpt.get();
        Quiz quiz = quizOpt.get();

        // O UNIQUE também protege envios simultâneos que passem por esta consulta.
        if (resultadoQuizRepository.findByUsuarioAndQuiz(usuario, quiz).isPresent()) {
            return ResponseEntity.badRequest().body(Map.of("success", false, "message", "Você já respondeu este quiz."));
        }


        if (!(body.get("respostas") instanceof Map<?, ?> respostasRecebidas)) {
            return ResponseEntity.badRequest().body(Map.of("success", false, "message", "Respostas devem ser um objeto de pergunta e alternativa."));
        }
        Object tempoRecebido = body.get("tempoGasto");
        if (tempoRecebido != null && (!(tempoRecebido instanceof Integer tempo) || tempo < 0)) {
            return ResponseEntity.badRequest().body(Map.of("success", false, "message", "tempoGasto deve ser um inteiro não negativo."));
        }
        Integer tempoGasto = (Integer) tempoRecebido;
        Map<String, Long> respostas = new HashMap<>();
        for (Map.Entry<?, ?> resposta : respostasRecebidas.entrySet()) {
            Long alternativaId = lerAlternativaId(resposta.getValue());
            Pergunta pergunta = quiz.getPerguntas().stream()
                    .filter(p -> String.valueOf(p.getId()).equals(resposta.getKey()))
                    .findFirst().orElse(null);
            // Uma alternativa válida de outra pergunta não pode contar como resposta desta.
            if (pergunta == null || alternativaId == null || pergunta.getAlternativas().stream()
                    .noneMatch(a -> a.getId().equals(alternativaId))) {
                return ResponseEntity.badRequest().body(Map.of("success", false, "message", "Resposta inválida para a pergunta informada."));
            }
            respostas.put(String.valueOf(pergunta.getId()), alternativaId);
        }

        int acertos = 0;
        int totalPerguntas = quiz.getPerguntas().size();

        for (Pergunta p : quiz.getPerguntas()) {
            Long altEscolhida = respostas.get(String.valueOf(p.getId()));
            if (altEscolhida != null) {
                boolean acertou = p.getAlternativas().stream()
                        .anyMatch(a -> a.getId().equals(altEscolhida) && a.getCorreta());
                if (acertou) acertos++;
            }
        }

        // calculo da nota: 100 pontos por acerto
        int notaBase = acertos * 100;
        
        ResultadoQuiz resultado = new ResultadoQuiz(usuario, quiz, notaBase, acertos, totalPerguntas, tempoGasto);
        resultadoQuizRepository.saveAndFlush(resultado);

        return ResponseEntity.ok(Map.of(
                "success", true,
                "acertos", acertos,
                "total", resultado.getTotalPerguntas(),
                "nota", notaBase
        ));
    }

    private Long lerAlternativaId(Object valor) {
        if (!(valor instanceof Integer) && !(valor instanceof Long) && !(valor instanceof String)) return null;
        try {
            long id = Long.parseLong(valor.toString());
            return id > 0 ? id : null;
        } catch (NumberFormatException exception) {
            return null;
        }
    }

    // A transação do envio já foi revertida quando o MVC trata a exceção.
    @ExceptionHandler(DataAccessException.class)
    public ResponseEntity<?> handleErroPersistencia(DataAccessException exception) {
        for (Throwable cause = exception; cause != null; cause = cause.getCause()) {
            if (cause instanceof ConstraintViolationException violation) {
                String constraint = violation.getConstraintName();
                if (constraint != null && (constraint.equals("uk_resultado_usuario_quiz")
                        || constraint.endsWith(".uk_resultado_usuario_quiz"))) {
                    return ResponseEntity.status(HttpStatus.CONFLICT).body(Map.of(
                            "success", false, "message", "Você já respondeu este quiz."));
                }
            }
        }
        logger.error("Erro de persistência do resultado do quiz", exception);
        return ResponseEntity.internalServerError().body(Map.of(
                "success", false, "message", "Erro ao salvar resultado do quiz."));
    }

    @GetMapping("/ranking")
    public ResponseEntity<?> getRanking() {
        List<Map<String, Object>> ranking = resultadoQuizRepository.getRankingGeral().stream().map(obj -> {
            Map<String, Object> map = new HashMap<>();
            map.put("usuarioId", obj[0]);
            map.put("nome", obj[1]);
            map.put("avatar", obj[2]);
            map.put("pontuacaoGeral", obj[3]);
            map.put("quizzesRealizados", obj[4]);
            map.put("mediaAcertos", obj[5]);
            return map;
        }).collect(Collectors.toList());
        return ResponseEntity.ok(ranking);
    }

    @GetMapping("/meus-badges")
    public ResponseEntity<?> getMeusBadges() {
        Optional<Usuario> usuarioOpt = getAuthenticatedUser();
        if (usuarioOpt.isEmpty()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        List<ResultadoQuiz> resultados = resultadoQuizRepository.findByUsuario(usuarioOpt.get());
        
        List<Map<String, Object>> badges = resultados.stream()
            .map(r -> {
                int total = r.getTotalPerguntas();
                double percentual = total == 0 ? 0 : (double) r.getAcertos() / total;
                boolean ganhouBadge = percentual >= 0.7; // 70% ou mais ganha o selo
                
                Map<String, Object> map = new HashMap<>();
                map.put("quizId", r.getQuiz().getId());
                map.put("titulo", r.getQuiz().getTitulo());
                map.put("acertos", r.getAcertos());
                map.put("nota", r.getNota());
                map.put("total", total);
                map.put("ganhouBadge", ganhouBadge);
                map.put("dataRealizacao", r.getDataRealizacao());
                return map;
            })
            .collect(Collectors.toList());

        return ResponseEntity.ok(badges);
    }
}

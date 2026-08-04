package com.pointmedia.auth.controller;

import com.pointmedia.auth.model.*;
import com.pointmedia.auth.repository.QuizRepository;
import com.pointmedia.auth.repository.ResultadoQuizRepository;
import com.pointmedia.auth.repository.UsuarioRepository;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

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

    private final QuizRepository quizRepository;
    private final ResultadoQuizRepository resultadoQuizRepository;
    private final UsuarioRepository usuarioRepository;

    public QuizController(QuizRepository quizRepository, ResultadoQuizRepository resultadoQuizRepository, UsuarioRepository usuarioRepository) {
        this.quizRepository = quizRepository;
        this.resultadoQuizRepository = resultadoQuizRepository;
        this.usuarioRepository = usuarioRepository;
    }

    private Optional<Usuario> getAuthenticatedUser() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        return usuarioRepository.findByEmail(email);
    }

    @GetMapping
    public ResponseEntity<?> listarQuizzes() {
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
            return map;
        }).collect(Collectors.toList());
        return ResponseEntity.ok(res);
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getQuizCompleto(@PathVariable Long id) {
        Optional<Quiz> quizOpt = quizRepository.findById(id);
        if (quizOpt.isEmpty()) return ResponseEntity.notFound().build();
        Quiz quiz = quizOpt.get();
        quiz.getPerguntas().size(); // force init
        for(Pergunta p : quiz.getPerguntas()) {
            p.getAlternativas().size(); // force init
        }

        // monta a resposta sem mostrar qual eh a certa
        Map<String, Object> quizMap = new HashMap<>();
        quizMap.put("id", quiz.getId());
        quizMap.put("titulo", quiz.getTitulo());
        quizMap.put("descricao", quiz.getDescricao());
        quizMap.put("categoria", quiz.getCategoria());
        quizMap.put("nivel", quiz.getNivel());
        quizMap.put("tempoMinutos", quiz.getTempoMinutos());
        quizMap.put("perguntas", quiz.getPerguntas().stream().map(p -> {
            Map<String, Object> pMap = new HashMap<>();
            pMap.put("id", p.getId());
            pMap.put("texto", p.getTexto());
            pMap.put("alternativas", p.getAlternativas().stream().map(a -> {
                Map<String, Object> aMap = new HashMap<>();
                aMap.put("id", a.getId());
                aMap.put("texto", a.getTexto());
                // nao mostra qual eh a certa pro usuario
                return aMap;
            }).collect(Collectors.toList()));
            return pMap;
        }).collect(Collectors.toList()));

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

        // nao deixa responder o mesmo quiz 2 vezes
        if (resultadoQuizRepository.findByUsuarioAndQuiz(usuario, quiz).isPresent()) {
            return ResponseEntity.badRequest().body(Map.of("success", false, "message", "Você já respondeu este quiz."));
        }


        @SuppressWarnings("unchecked")
        Map<String, Object> respostas = (Map<String, Object>) body.get("respostas");
        Integer tempoGasto = (Integer) body.get("tempoGasto");

        int acertos = 0;
        int totalPerguntas = quiz.getPerguntas().size();

        for (Pergunta p : quiz.getPerguntas()) {
            Object altIdObj = respostas.get(String.valueOf(p.getId()));
            if (altIdObj != null) {
                Long altEscolhida = Long.valueOf(altIdObj.toString());
                boolean acertou = p.getAlternativas().stream()
                        .anyMatch(a -> a.getId().equals(altEscolhida) && a.getCorreta());
                if (acertou) acertos++;
            }
        }

        // calculo da nota: 100 pontos por acerto
        int notaBase = acertos * 100;
        
        ResultadoQuiz resultado = new ResultadoQuiz(usuario, quiz, notaBase, acertos, tempoGasto);
        resultadoQuizRepository.save(resultado);

        return ResponseEntity.ok(Map.of(
                "success", true,
                "acertos", acertos,
                "total", totalPerguntas,
                "nota", notaBase
        ));
    }

    @GetMapping("/ranking")
    public ResponseEntity<?> getRanking() {
        // monta o ranking geral
        List<Map<String, Object>> ranking = resultadoQuizRepository.getRankingGeral().stream().map(obj -> {
            Map<String, Object> map = new HashMap<>();
            map.put("usuarioId", obj[0]);
            map.put("nome", obj[1]);
            map.put("email", obj[2]);
            map.put("avatar", obj[3]);
            map.put("pontuacaoGeral", obj[4]);
            map.put("quizzesRealizados", obj[5]);
            map.put("mediaAcertos", obj[6]);
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
                int total = r.getQuiz().getPerguntas().size();
                double percentual = total == 0 ? 0 : (double) r.getAcertos() / total;
                boolean ganhouBadge = percentual >= 0.7; // 70% ou mais ganha o selo
                
                Map<String, Object> map = new HashMap<>();
                map.put("quizId", r.getQuiz().getId());
                map.put("titulo", r.getQuiz().getTitulo());
                map.put("acertos", r.getAcertos());
                map.put("total", total);
                map.put("ganhouBadge", ganhouBadge);
                map.put("dataRealizacao", r.getDataRealizacao());
                return map;
            })
            .collect(Collectors.toList());

        return ResponseEntity.ok(badges);
    }
}

package com.pointmedia.auth.controller;

import com.pointmedia.auth.repository.*;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/admin/stats")
@Transactional
public class AdminStatsController {

    private final CurriculoRepository curriculoRepository;
    private final VagaRepository vagaRepository;
    private final ResultadoQuizRepository resultadoQuizRepository;
    private final CandidaturaRepository candidaturaRepository;

    public AdminStatsController(
            CurriculoRepository curriculoRepository,
            VagaRepository vagaRepository,
            ResultadoQuizRepository resultadoQuizRepository,
            CandidaturaRepository candidaturaRepository
    ) {
        this.curriculoRepository = curriculoRepository;
        this.vagaRepository = vagaRepository;
        this.resultadoQuizRepository = resultadoQuizRepository;
        this.candidaturaRepository = candidaturaRepository;
    }

    @GetMapping
    public ResponseEntity<?> getStats() {
        long totalCandidatos = curriculoRepository.countCandidatosComCandidatura();
        long totalVagas = vagaRepository.count();
        long totalQuizzesRealizados = resultadoQuizRepository.count();
        long totalCandidaturas = candidaturaRepository.count();

        // calcula media de acerto em porcentagem
        double mediaAcertosGeral = resultadoQuizRepository.findAll().stream()
                .mapToDouble(r -> {
                    int totalPerguntas = r.getQuiz().getPerguntas().size();
                    if (totalPerguntas == 0) return 0.0;
                    return ((double) r.getAcertos() / totalPerguntas) * 100.0;
                })
                .average()
                .orElse(0.0);

        Map<String, Object> stats = new HashMap<>();
        stats.put("totalCandidatos", totalCandidatos);
        stats.put("totalVagas", totalVagas);
        stats.put("totalQuizzes", totalQuizzesRealizados);
        stats.put("totalCandidaturas", totalCandidaturas);
        stats.put("mediaAcertosGeral", Math.round(mediaAcertosGeral));

        return ResponseEntity.ok(stats);
    }
}

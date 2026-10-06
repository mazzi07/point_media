package com.pointmedia.auth.controller;

import com.pointmedia.auth.repository.CandidaturaRepository;
import com.pointmedia.auth.repository.CurriculoRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.springframework.transaction.annotation.Transactional;

@RestController
@RequestMapping("/api/admin")
@Transactional
public class CandidatoController {

    private final CurriculoRepository curriculoRepository;
    private final CandidaturaRepository candidaturaRepository;

    public CandidatoController(CurriculoRepository curriculoRepository, CandidaturaRepository candidaturaRepository) {
        this.curriculoRepository = curriculoRepository;
        this.candidaturaRepository = candidaturaRepository;
    }

    @GetMapping("/candidatos")
    public ResponseEntity<?> listar(
        @RequestParam(required = false) String cargo,
        @RequestParam(required = false) String habilidade
    ) {
        List<Map<String, Object>> candidatos = curriculoRepository
            .findWithFilters(
                (cargo != null && !cargo.isBlank()) ? cargo : null,
                (habilidade != null && !habilidade.isBlank()) ? habilidade : null
            )
            .stream()
            .map(c -> {
                Map<String, Object> candidatoDados = new HashMap<>();
                candidatoDados.put("usuarioId", c.getUsuario().getId());
                candidatoDados.put("nome", c.getUsuario().getNome());
                candidatoDados.put("email", c.getUsuario().getEmail());
                candidatoDados.put("avatar", c.getUsuario().getAvatar());
                candidatoDados.put("cargo", c.getCargo());
                candidatoDados.put("experiencia", c.getExperiencia());
                candidatoDados.put("habilidades", new java.util.ArrayList<>(c.getHabilidades()));
                candidatoDados.put("linkedin", c.getLinkedin());
                candidatoDados.put("github", c.getGithub());
                
                List<Map<String, Object>> vagasCandidatadas = candidaturaRepository.findByUsuario(c.getUsuario())
                    .stream()
                    .map(cand -> {
                        Map<String, Object> vagaDados = new HashMap<>();
                        vagaDados.put("id", cand.getVaga().getId());
                        vagaDados.put("titulo", cand.getVaga().getTitulo());
                        return vagaDados;
                    })
                    .collect(Collectors.toList());
                candidatoDados.put("vagasCandidatadas", vagasCandidatadas);

                return candidatoDados;
            })
            .collect(Collectors.toList());

        return ResponseEntity.ok(candidatos);
    }
}

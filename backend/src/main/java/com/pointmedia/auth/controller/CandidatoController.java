package com.pointmedia.auth.controller;

import com.pointmedia.auth.model.Curriculo;
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

    public CandidatoController(CurriculoRepository curriculoRepository) {
        this.curriculoRepository = curriculoRepository;
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
                Map<String, Object> m = new HashMap<>();
                m.put("usuarioId", c.getUsuario().getId());
                m.put("nome", c.getUsuario().getNome());
                m.put("email", c.getUsuario().getEmail());
                m.put("avatar", c.getUsuario().getAvatar());
                m.put("cargo", c.getCargo());
                m.put("experiencia", c.getExperiencia());
                m.put("habilidades", new java.util.ArrayList<>(c.getHabilidades()));
                m.put("linkedin", c.getLinkedin());
                m.put("github", c.getGithub());
                return m;
            })
            .collect(Collectors.toList());

        return ResponseEntity.ok(candidatos);
    }
}

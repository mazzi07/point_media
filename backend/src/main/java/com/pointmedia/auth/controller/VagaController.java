package com.pointmedia.auth.controller;

import com.pointmedia.auth.model.Candidatura;
import com.pointmedia.auth.model.Usuario;
import com.pointmedia.auth.model.Vaga;
import com.pointmedia.auth.repository.CandidaturaRepository;
import com.pointmedia.auth.repository.UsuarioRepository;
import com.pointmedia.auth.repository.VagaRepository;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.authentication.AnonymousAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.dao.DataAccessException;
import org.hibernate.exception.ConstraintViolationException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/vagas")
@Transactional
public class VagaController {

    private static final Logger logger = LoggerFactory.getLogger(VagaController.class);

    private final VagaRepository vagaRepository;
    private final CandidaturaRepository candidaturaRepository;
    private final UsuarioRepository usuarioRepository;

    public VagaController(VagaRepository vagaRepository, CandidaturaRepository candidaturaRepository, UsuarioRepository usuarioRepository) {
        this.vagaRepository = vagaRepository;
        this.candidaturaRepository = candidaturaRepository;
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
    public ResponseEntity<List<Vaga>> listarVagas(
            @RequestParam(required = false) String area,
            @RequestParam(required = false) String busca) {
        
        List<Vaga> vagas = vagaRepository.findByFiltros(area, busca);
        return ResponseEntity.ok(vagas);
    }

    @PostMapping("/{id}/candidatar")
    public ResponseEntity<?> candidatar(@PathVariable Long id) {
        Optional<Usuario> usuarioOpt = getAuthenticatedUser();
        if (usuarioOpt.isEmpty()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        Optional<Vaga> vagaOpt = vagaRepository.findById(id);
        if (vagaOpt.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("success", false, "message", "Vaga não encontrada."));
        }

        Usuario usuario = usuarioOpt.get();
        Vaga vaga = vagaOpt.get();

        if (candidaturaRepository.existsByUsuarioAndVaga(usuario, vaga)) {
            return ResponseEntity.badRequest().body(Map.of("success", false, "message", "Você já se candidatou para esta vaga."));
        }

        Candidatura candidatura = new Candidatura(usuario, vaga);
        // O UNIQUE continua necessário: duas requisições podem passar pelo pre-check.
        candidaturaRepository.saveAndFlush(candidatura);

        return ResponseEntity.ok(Map.of("success", true, "message", "Candidatura realizada com sucesso."));
    }

    // O MVC trata a violação depois que a transação da candidatura foi revertida.
    @ExceptionHandler(DataAccessException.class)
    public ResponseEntity<?> handleErroPersistencia(DataAccessException exception) {
        for (Throwable cause = exception; cause != null; cause = cause.getCause()) {
            if (cause instanceof ConstraintViolationException violation) {
                String constraint = violation.getConstraintName();
                if (constraint != null && (constraint.equals("uk_candidatura_usuario_vaga")
                        || constraint.endsWith(".uk_candidatura_usuario_vaga"))) {
                    return ResponseEntity.status(HttpStatus.CONFLICT).body(Map.of(
                            "success", false, "message", "Você já se candidatou para esta vaga."));
                }
            }
        }
        logger.error("Erro de persistência da candidatura", exception);
        return ResponseEntity.internalServerError().body(Map.of(
                "success", false, "message", "Erro ao registrar candidatura."));
    }

    @GetMapping("/minhas-candidaturas")
    public ResponseEntity<?> minhasCandidaturas() {
        Optional<Usuario> usuarioOpt = getAuthenticatedUser();
        if (usuarioOpt.isEmpty()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        List<Map<String, Object>> candidaturas = candidaturaRepository.findByUsuario(usuarioOpt.get())
            .stream()
            .map(c -> {
                Map<String, Object> map = new HashMap<>();
                map.put("vagaId", c.getVaga().getId());
                map.put("titulo", c.getVaga().getTitulo());
                map.put("area", c.getVaga().getArea());
                map.put("dataCandidatura", c.getDataCandidatura());
                return map;
            })
            .collect(Collectors.toList());

        return ResponseEntity.ok(candidaturas);
    }
}

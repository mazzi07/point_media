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

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/vagas")
@Transactional
public class VagaController {

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
        candidaturaRepository.save(candidatura);

        return ResponseEntity.ok(Map.of("success", true, "message", "Candidatura realizada com sucesso."));
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

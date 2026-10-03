package com.pointmedia.auth.controller;

import com.pointmedia.auth.model.Curriculo;
import com.pointmedia.auth.model.Usuario;
import com.pointmedia.auth.repository.CurriculoRepository;
import com.pointmedia.auth.repository.UsuarioRepository;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@RestController
@RequestMapping("/api/curriculo")
public class CurriculoController {

    private static final Logger logger = LoggerFactory.getLogger(CurriculoController.class);

    private final CurriculoRepository curriculoRepository;
    private final UsuarioRepository usuarioRepository;

    public CurriculoController(CurriculoRepository curriculoRepository,
                                UsuarioRepository usuarioRepository) {
        this.curriculoRepository = curriculoRepository;
        this.usuarioRepository = usuarioRepository;
    }

    // pega o usuario logado pelo token
    private Optional<Usuario> getAuthenticatedUser() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        return usuarioRepository.findByEmail(email);
    }

    @GetMapping
    @Transactional
    public ResponseEntity<?> buscar() {
        Optional<Usuario> usuarioOpt = getAuthenticatedUser();
        if (usuarioOpt.isEmpty()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        return curriculoRepository.findByUsuario(usuarioOpt.get())
            .map(c -> {
                Map<String, Object> response = new HashMap<>();
                response.put("cargo", c.getCargo());
                response.put("experiencia", c.getExperiencia());
                response.put("linkedin", c.getLinkedin());
                response.put("github", c.getGithub());
                response.put("habilidades", new java.util.ArrayList<>(c.getHabilidades()));
                return ResponseEntity.ok(response);
            })
            .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    @Transactional
    public ResponseEntity<?> salvar(@RequestBody Map<String, Object> request) {
        Optional<Usuario> usuarioOpt = getAuthenticatedUser();
        if (usuarioOpt.isEmpty()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        Usuario usuario = usuarioOpt.get();

        try {
            Curriculo curriculo = curriculoRepository.findByUsuario(usuario)
                .orElse(new Curriculo(usuario));

            curriculo.setCargo((String) request.get("cargo"));
            curriculo.setExperiencia((String) request.get("experiencia"));
            curriculo.setLinkedin((String) request.get("linkedin"));
            curriculo.setGithub((String) request.get("github"));

            @SuppressWarnings("unchecked")
            List<String> habilidades = (List<String>) request.get("habilidades");
            if (habilidades != null) {
                curriculo.getHabilidades().clear();
                curriculo.getHabilidades().addAll(habilidades);
            }

            curriculoRepository.save(curriculo);

            return ResponseEntity.ok(Map.of("success", true, "message", "Currículo salvo com sucesso."));
        } catch (Exception e) {
            logger.error("Erro ao salvar currículo para usuario: {}", usuario.getEmail(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(Map.of("success", false, "message", "Ocorreu um erro interno ao salvar o currículo."));
        }
    }
}

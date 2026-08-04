package com.pointmedia.auth.controller;

import com.pointmedia.auth.model.Usuario;
import com.pointmedia.auth.repository.UsuarioRepository;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/usuarios")
public class UsuarioController {

    private final UsuarioRepository usuarioRepository;

    public UsuarioController(UsuarioRepository usuarioRepository) {
        this.usuarioRepository = usuarioRepository;
    }

    private Optional<Usuario> getAuthenticatedUser() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        return usuarioRepository.findByEmail(email);
    }

    @PostMapping("/avatar")
    public ResponseEntity<?> atualizarAvatar(@RequestBody Map<String, String> body) {
        Optional<Usuario> usuarioOpt = getAuthenticatedUser();
        if (usuarioOpt.isEmpty()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        String base64Avatar = body.get("avatar");
        if (base64Avatar == null || base64Avatar.isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of("success", false, "message", "Avatar não fornecido."));
        }

        Usuario usuario = usuarioOpt.get();
        usuario.setAvatar(base64Avatar);
        usuarioRepository.save(usuario);

        return ResponseEntity.ok(Map.of("success", true, "message", "Avatar atualizado com sucesso."));
    }
}

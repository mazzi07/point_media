package com.pointmedia.auth.controller;

import com.pointmedia.auth.model.Usuario;
import com.pointmedia.auth.repository.UsuarioRepository;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.authentication.AnonymousAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.Optional;
import java.util.Base64;
import java.io.ByteArrayInputStream;
import java.io.IOException;
import javax.imageio.ImageIO;
import javax.imageio.stream.ImageInputStream;

@RestController
@RequestMapping("/api/usuarios")
public class UsuarioController {

    // Mesma política dos dois seletores: JPEG/PNG, até 1 MiB decodificado.
    private static final int MAX_AVATAR_BYTES = 1024 * 1024;

    private boolean isValidAvatar(String avatar) {
        if (avatar == null) return false;
        String prefix;
        String format;
        if (avatar.startsWith("data:image/png;base64,")) {
            prefix = "data:image/png;base64,";
            format = "png";
        } else if (avatar.startsWith("data:image/jpeg;base64,")) {
            prefix = "data:image/jpeg;base64,";
            format = "jpeg";
        } else {
            return false;
        }
        if (avatar.length() - prefix.length() > 4 * ((MAX_AVATAR_BYTES + 2) / 3)) return false;
        try {
            byte[] bytes = Base64.getDecoder().decode(avatar.substring(prefix.length()));
            if (bytes.length == 0 || bytes.length > MAX_AVATAR_BYTES) return false;
            try (ImageInputStream input = ImageIO.createImageInputStream(new ByteArrayInputStream(bytes))) {
                var readers = ImageIO.getImageReaders(input);
                if (!readers.hasNext()) return false;
                var reader = readers.next();
                try {
                    reader.setInput(input);
                    // Verifica o formato real e os cabeçalhos sem descomprimir a imagem em memória.
                    return reader.getFormatName().equalsIgnoreCase(format)
                            && reader.getWidth(0) > 0 && reader.getHeight(0) > 0;
                } finally {
                    reader.dispose();
                }
            }
        } catch (IllegalArgumentException | IOException e) {
            return false;
        }
    }

    private final UsuarioRepository usuarioRepository;

    public UsuarioController(UsuarioRepository usuarioRepository) {
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

    @PostMapping("/avatar")
    public ResponseEntity<?> atualizarAvatar(@RequestBody Map<String, String> body) {
        Optional<Usuario> usuarioOpt = getAuthenticatedUser();
        if (usuarioOpt.isEmpty()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        String base64Avatar = body.get("avatar");
        if (!isValidAvatar(base64Avatar)) {
            return ResponseEntity.badRequest().body(Map.of("success", false, "message", "Envie uma imagem JPEG ou PNG em data URL, com conteúdo e até 1 MiB (1.048.576 bytes)."));
        }

        Usuario usuario = usuarioOpt.get();
        usuario.setAvatar(base64Avatar);
        usuarioRepository.save(usuario);

        return ResponseEntity.ok(Map.of("success", true, "message", "Avatar atualizado com sucesso."));
    }
}

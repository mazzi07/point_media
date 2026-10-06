package com.pointmedia.auth.controller;

import com.pointmedia.auth.model.Curriculo;
import com.pointmedia.auth.model.Usuario;
import com.pointmedia.auth.repository.CurriculoRepository;
import com.pointmedia.auth.repository.UsuarioRepository;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.authentication.AnonymousAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.nio.charset.StandardCharsets;
import java.net.URI;
import org.springframework.dao.DataAccessException;
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

    private Optional<Usuario> getAuthenticatedUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        // O principal anônimo do Spring também pode ter isAuthenticated=true.
        if (authentication == null || !authentication.isAuthenticated()
                || authentication instanceof AnonymousAuthenticationToken) {
            return Optional.empty();
        }
        return usuarioRepository.findByEmail(authentication.getName());
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

        String erro = validarCurriculo(request);
        if (erro != null) {
            return ResponseEntity.badRequest().body(Map.of("success", false, "message", erro));
        }

        // Validamos tudo antes de tocar a entidade gerenciada e suas coleções.
        Usuario usuario = usuarioOpt.get();
        Curriculo curriculo = curriculoRepository.findByUsuario(usuario)
                .orElse(new Curriculo(usuario));

        curriculo.setCargo((String) request.get("cargo"));
        curriculo.setExperiencia((String) request.get("experiencia"));
        curriculo.setLinkedin((String) request.get("linkedin"));
        curriculo.setGithub((String) request.get("github"));

        List<?> habilidades = (List<?>) request.get("habilidades");
        if (habilidades != null) {
            curriculo.getHabilidades().clear();
            for (Object habilidade : habilidades) {
                curriculo.getHabilidades().add((String) habilidade);
            }
        }

        curriculoRepository.save(curriculo);

        return ResponseEntity.ok(Map.of("success", true, "message", "Currículo salvo com sucesso."));
    }

    // Fora do método transacional: a falha não pode deixar alterações pendentes.
    @ExceptionHandler(DataAccessException.class)
    public ResponseEntity<?> handleErroPersistencia(DataAccessException exception) {
        logger.error("Erro de persistência do currículo", exception);
        return ResponseEntity.internalServerError().body(Map.of(
                "success", false, "message", "Ocorreu um erro interno ao salvar o currículo."));
    }

    private String validarCurriculo(Map<String, Object> request) {
        if (!(request.get("cargo") instanceof String cargo) || cargo.isBlank() || cargo.length() > 255) {
            return "Informe um cargo de até 255 caracteres.";
        }
        if (!(request.get("experiencia") instanceof String experiencia) || experiencia.isBlank()
                || experiencia.getBytes(StandardCharsets.UTF_8).length > 65535) {
            return "Informe uma experiência de até 65535 bytes em UTF-8.";
        }
        for (String campo : List.of("linkedin", "github")) {
            Object valor = request.get(campo);
            if (valor != null && (!(valor instanceof String link) || link.length() > 255 || !linkValido(link))) {
                return campo + " deve ser um endereço HTTP/HTTPS de até 255 caracteres.";
            }
        }
        if (request.containsKey("habilidades")) {
            if (!(request.get("habilidades") instanceof List<?> habilidades)) {
                return "Habilidades devem ser uma lista de textos.";
            }
            for (Object valor : habilidades) {
                if (!(valor instanceof String habilidade) || habilidade.isBlank() || habilidade.length() > 255) {
                    return "Cada habilidade deve ser um texto não vazio de até 255 caracteres.";
                }
            }
        }
        return null;
    }

    private boolean linkValido(String link) {
        if (link.isBlank()) return true;
        try {
            String endereco = link.trim();
            boolean temProtocolo = endereco.matches("(?i)^[a-z][a-z0-9+.-]*:.*");
            URI uri = new URI(temProtocolo ? endereco : "https://" + endereco);
            return ("http".equalsIgnoreCase(uri.getScheme()) || "https".equalsIgnoreCase(uri.getScheme()))
                    && uri.getHost() != null && uri.getUserInfo() == null;
        } catch (java.net.URISyntaxException exception) {
            return false;
        }
    }
}

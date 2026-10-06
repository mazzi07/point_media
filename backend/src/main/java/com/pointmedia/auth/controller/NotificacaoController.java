package com.pointmedia.auth.controller;

import com.pointmedia.auth.model.Notificacao;
import com.pointmedia.auth.model.Usuario;
import com.pointmedia.auth.repository.NotificacaoRepository;
import com.pointmedia.auth.repository.UsuarioRepository;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.authentication.AnonymousAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;
import java.nio.charset.StandardCharsets;

@RestController
public class NotificacaoController {

    private final NotificacaoRepository notificacaoRepository;
    private final UsuarioRepository usuarioRepository;

    public NotificacaoController(NotificacaoRepository notificacaoRepository,
                                  UsuarioRepository usuarioRepository) {
        this.notificacaoRepository = notificacaoRepository;
        this.usuarioRepository     = usuarioRepository;
    }

    private Optional<Usuario> getAuthenticatedUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated()
                || authentication instanceof AnonymousAuthenticationToken) {
            return Optional.empty();
        }
        return usuarioRepository.findByEmail(authentication.getName());
    }

    // GET /api/notificacoes — lista notificações do usuário logado
    @GetMapping("/api/notificacoes")
    public ResponseEntity<?> listar() {
        Optional<Usuario> usuarioOpt = getAuthenticatedUser();
        if (usuarioOpt.isEmpty()) return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();

        List<Map<String, Object>> lista = notificacaoRepository
            .findByUsuarioOrderByCreatedAtDesc(usuarioOpt.get())
            .stream()
            .map(n -> {
                Map<String, Object> m = new HashMap<>();
                m.put("id", n.getId());
                m.put("titulo", n.getTitulo());
                m.put("mensagem", n.getMensagem());
                m.put("lida", n.isLida());
                m.put("createdAt", n.getCreatedAt().toString());
                return m;
            })
            .collect(Collectors.toList());

        return ResponseEntity.ok(lista);
    }

    // PUT /api/notificacoes/{id}/ler — marca notificação como lida
    @PutMapping("/api/notificacoes/{id}/ler")
    public ResponseEntity<?> marcarLida(@PathVariable Long id) {
        Optional<Usuario> usuarioOpt = getAuthenticatedUser();
        if (usuarioOpt.isEmpty()) return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();

        Optional<Notificacao> notificacaoOpt = notificacaoRepository.findById(id);
        if (notificacaoOpt.isEmpty()) return ResponseEntity.notFound().build();

        Notificacao n = notificacaoOpt.get();
        // Garante que o usuário só pode marcar suas próprias notificações
        if (!n.getUsuario().getId().equals(usuarioOpt.get().getId())) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }

        n.setLida(true);
        notificacaoRepository.save(n);
        return ResponseEntity.ok(Map.of("success", true));
    }

    // POST /api/admin/notificacoes — admin envia notificação a um candidato
    @PostMapping("/api/admin/notificacoes")
    public ResponseEntity<?> enviar(@RequestBody Map<String, Object> request) {
        Long usuarioId = lerDestinatario(request.get("usuarioId"));
        if (usuarioId == null) {
            return ResponseEntity.badRequest().body(Map.of("success", false, "message", "Informe um usuarioId inteiro positivo."));
        }
        if (!(request.get("titulo") instanceof String titulo) || titulo.isBlank() || titulo.length() > 255
                || !(request.get("mensagem") instanceof String mensagem) || mensagem.isBlank()
                || mensagem.getBytes(StandardCharsets.UTF_8).length > 65535) {
            return ResponseEntity.badRequest()
                .body(Map.of("success", false, "message", "Informe título (até 255 caracteres) e mensagem (até 65535 bytes em UTF-8) não vazios."));
        }

        Optional<Usuario> destinatarioOpt = usuarioRepository.findById(usuarioId);
        if (destinatarioOpt.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                .body(Map.of("success", false, "message", "Usuário não encontrado."));
        }

        Notificacao n = new Notificacao(destinatarioOpt.get(), titulo, mensagem);
        notificacaoRepository.save(n);

        return ResponseEntity.status(HttpStatus.CREATED)
            .body(Map.of("success", true, "message", "Notificação enviada com sucesso."));
    }

    private Long lerDestinatario(Object valor) {
        if (!(valor instanceof Integer) && !(valor instanceof Long) && !(valor instanceof String)) return null;
        try {
            long id = Long.parseLong(valor.toString());
            return id > 0 ? id : null;
        } catch (NumberFormatException exception) {
            return null;
        }
    }
}

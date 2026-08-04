package com.pointmedia.auth.controller;

import com.pointmedia.auth.model.Notificacao;
import com.pointmedia.auth.model.Usuario;
import com.pointmedia.auth.repository.NotificacaoRepository;
import com.pointmedia.auth.repository.UsuarioRepository;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

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
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        return usuarioRepository.findByEmail(email);
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
        Long usuarioId = Long.valueOf(request.get("usuarioId").toString());
        String titulo   = (String) request.get("titulo");
        String mensagem = (String) request.get("mensagem");

        if (titulo == null || titulo.isBlank() || mensagem == null || mensagem.isBlank()) {
            return ResponseEntity.badRequest()
                .body(Map.of("success", false, "message", "Título e mensagem são obrigatórios."));
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
}

package com.pointmedia.auth.controller;

import com.pointmedia.auth.model.TipoUsuario;
import com.pointmedia.auth.model.Usuario;
import com.pointmedia.auth.repository.UsuarioRepository;
import com.pointmedia.auth.security.JwtUtil;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.http.ResponseCookie;
import org.springframework.http.HttpHeaders;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;
import java.util.regex.Pattern;
import java.nio.charset.StandardCharsets;

import org.springframework.beans.factory.annotation.Value;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private static final Pattern EMAIL_PATTERN = Pattern.compile(
            "^[A-Za-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\\.[A-Za-z0-9!#$%&'*+/=?^_`{|}~-]+)*"
            + "@[A-Za-z0-9](?:[A-Za-z0-9-]{0,61}[A-Za-z0-9])?"
            + "(?:\\.[A-Za-z0-9](?:[A-Za-z0-9-]{0,61}[A-Za-z0-9])?)+$");

    private final UsuarioRepository usuarioRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;

    @Value("${PRODUCTION:false}")
    private boolean isProduction;

    public AuthController(UsuarioRepository usuarioRepository,
                          PasswordEncoder passwordEncoder,
                          JwtUtil jwtUtil) {
        this.usuarioRepository = usuarioRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtUtil = jwtUtil;
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody Map<String, Object> request) {
        String erro = validarCredenciais(request);
        if (erro != null) {
            return ResponseEntity.badRequest().body(Map.of("success", false, "message", erro));
        }
        if (!(request.get("nome") instanceof String nome) || nome.isBlank() || nome.length() > 255) {
            return ResponseEntity.badRequest().body(Map.of("success", false, "message", "Informe um nome de até 255 caracteres."));
        }
        try {
            String email = (String) request.get("email");
            String senha = (String) request.get("senha");

            if (senha.length() < 6) {
                return ResponseEntity.badRequest()
                    .body(Map.of("success", false, "message", "A senha deve ter no mínimo 6 caracteres."));
            }

            if (usuarioRepository.findByEmail(email).isPresent()) {
                return ResponseEntity.status(HttpStatus.CONFLICT)
                    .body(Map.of("success", false, "message", "E-mail já está em uso."));
            }

            // O cadastro público nunca pode promover uma conta por dados do cliente.
            TipoUsuario tipoUsuario = TipoUsuario.CANDIDATO;
            String senhaHash = passwordEncoder.encode(senha);

            Usuario novoUsuario = new Usuario(nome, email, senhaHash, tipoUsuario);
            usuarioRepository.save(novoUsuario);

            // gera o token pra logar automatico depois do cadastro
            String token = jwtUtil.generateToken(email, tipoUsuario.name());

            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            
            Map<String, String> userInfo = new HashMap<>();
            userInfo.put("nome", nome);
            userInfo.put("email", email);
            userInfo.put("tipo", tipoUsuario.name());
            userInfo.put("avatar", novoUsuario.getAvatar());
            response.put("usuario", userInfo);

            boolean lembrarMe = Boolean.parseBoolean(String.valueOf(request.get("lembrar_me")));
            int maxAge = lembrarMe ? (7 * 24 * 60 * 60) : -1;

            ResponseCookie jwtCookie = ResponseCookie.from("pm_token", token)
                .httpOnly(true)
                .secure(isProduction)
                .path("/")
                .sameSite("Lax")
                .maxAge(maxAge)
                .build();

            return ResponseEntity.status(HttpStatus.CREATED)
                .header(HttpHeaders.SET_COOKIE, jwtCookie.toString())
                .body(response);

        } catch (Exception e) {
            return ResponseEntity.internalServerError()
                .body(Map.of("success", false, "message", "Erro ao registrar usuário."));
        }
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, Object> request) {
        String erro = validarCredenciais(request);
        if (erro != null) {
            return ResponseEntity.badRequest().body(Map.of("success", false, "message", erro));
        }
        String email = (String) request.get("email");
        String senha = (String) request.get("senha");

        Optional<Usuario> usuarioOpt = usuarioRepository.findByEmail(email);

        if (usuarioOpt.isEmpty() || !passwordEncoder.matches(senha, usuarioOpt.get().getSenhaHash())) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                .body(Map.of("success", false, "message", "Credenciais inválidas."));
        }

        Usuario usuario = usuarioOpt.get();
        String token = jwtUtil.generateToken(usuario.getEmail(), usuario.getTipoUsuario().name());

        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        
        Map<String, String> userInfo = new HashMap<>();
        userInfo.put("nome", usuario.getNome());
        userInfo.put("email", usuario.getEmail());
        userInfo.put("tipo", usuario.getTipoUsuario().name());
        userInfo.put("avatar", usuario.getAvatar());
        response.put("usuario", userInfo);

        boolean lembrarMe = Boolean.parseBoolean(String.valueOf(request.get("lembrar_me")));
        int maxAge = lembrarMe ? (7 * 24 * 60 * 60) : -1;

        ResponseCookie jwtCookie = ResponseCookie.from("pm_token", token)
            .httpOnly(true)
            .secure(isProduction)
            .path("/")
            .sameSite("Lax")
            .maxAge(maxAge)
            .build();

        return ResponseEntity.ok()
            .header(HttpHeaders.SET_COOKIE, jwtCookie.toString())
            .body(response);
    }

    private String validarCredenciais(Map<String, Object> request) {
        if (!(request.get("email") instanceof String email) || email.isBlank()
                || !(request.get("senha") instanceof String senha) || senha.isBlank()) {
            return "E-mail e senha devem ser textos não vazios.";
        }
        if (email.length() > 254 || !EMAIL_PATTERN.matcher(email).matches() || email.indexOf('@') > 64) {
            return "Informe um e-mail válido.";
        }
        // BCrypt limita a senha em bytes, não em caracteres; não a truncamos.
        if (senha.getBytes(StandardCharsets.UTF_8).length > 72) {
            return "A senha deve ter no máximo 72 bytes em UTF-8.";
        }
        Object lembrarMe = request.get("lembrar_me");
        if (request.containsKey("lembrar_me") && !(lembrarMe instanceof Boolean)
                && !"true".equals(lembrarMe) && !"false".equals(lembrarMe)) {
            return "lembrar_me deve ser um booleano.";
        }
        return null;
    }

    @PostMapping("/logout")
    public ResponseEntity<?> logout() {
        // apaga o cookie do navegador
        ResponseCookie jwtCookie = ResponseCookie.from("pm_token", "")
            .httpOnly(true)
            .secure(isProduction)
            .path("/")
            .sameSite("Lax")
            .maxAge(0)
            .build();

        return ResponseEntity.ok()
            .header(HttpHeaders.SET_COOKIE, jwtCookie.toString())
            .body(Map.of("success", true, "message", "Logout realizado com sucesso."));
    }
}

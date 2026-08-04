package com.pointmedia.auth;

import com.pointmedia.auth.model.Usuario;
import com.pointmedia.auth.model.TipoUsuario;
import com.pointmedia.auth.repository.UsuarioRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class AuthApplication {

	public static void main(String[] args) {
		SpringApplication.run(AuthApplication.class, args);
	}

	@Bean
	public CommandLineRunner adminInit(UsuarioRepository usuarioRepository, PasswordEncoder passwordEncoder) {
		return args -> {
			if (usuarioRepository.findByEmail("admin@pointmedia.com").isEmpty()) {
				Usuario admin = new Usuario("Admin Point Media", "admin@pointmedia.com", passwordEncoder.encode("admin123"), TipoUsuario.ADMIN);
				usuarioRepository.save(admin);
				System.out.println("ADMIN CREATED SUCCESSFULLY!");
			} else {
				System.out.println("Admin already exists, skipping creation.");
			}
		};
	}
}

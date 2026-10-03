package com.pointmedia.auth;

import com.pointmedia.auth.model.Usuario;
import com.pointmedia.auth.model.TipoUsuario;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class AuthApplication {

	public static void main(String[] args) {
		SpringApplication.run(AuthApplication.class, args);
	}

}

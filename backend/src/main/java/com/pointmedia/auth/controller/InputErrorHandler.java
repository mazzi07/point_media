package com.pointmedia.auth.controller;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.dao.DataAccessException;
import org.springframework.http.ResponseEntity;
import org.springframework.http.converter.HttpMessageNotReadableException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.util.Map;

@RestControllerAdvice(assignableTypes = {
        AuthController.class, CurriculoController.class, AdminVagaController.class,
        NotificacaoController.class, QuizController.class, VagaController.class
})
public class InputErrorHandler {

    private static final Logger logger = LoggerFactory.getLogger(InputErrorHandler.class);

    // Responde no MVC: o encaminhamento para /error pode perder a autenticação.
    @ExceptionHandler(HttpMessageNotReadableException.class)
    public ResponseEntity<?> handleCorpoInvalido(HttpMessageNotReadableException exception) {
        return ResponseEntity.badRequest().body(Map.of(
                "success", false, "message", "Envie um corpo JSON válido com os tipos esperados."));
    }

    @ExceptionHandler(DataAccessException.class)
    public ResponseEntity<?> handleErroPersistencia(DataAccessException exception) {
        logger.error("Erro de persistência na API", exception);
        return ResponseEntity.internalServerError().body(Map.of(
                "success", false, "message", "Não foi possível concluir a operação."));
    }
}

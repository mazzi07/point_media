package com.pointmedia.auth.controller;

import com.pointmedia.auth.model.Vaga;
import com.pointmedia.auth.repository.VagaRepository;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Map;
import java.util.Optional;
import org.springframework.dao.DataAccessException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@RestController
@RequestMapping("/api/admin/vagas")
@Transactional
public class AdminVagaController {

    private static final Logger logger = LoggerFactory.getLogger(AdminVagaController.class);

    private final VagaRepository vagaRepository;

    public AdminVagaController(VagaRepository vagaRepository) {
        this.vagaRepository = vagaRepository;
    }

    @PostMapping
    public ResponseEntity<?> criarVaga(@RequestBody Map<String, Object> request) {
        String erro = validarVaga(request, true);
        if (erro != null) {
            return ResponseEntity.badRequest().body(Map.of("success", false, "message", erro));
        }
        Vaga vaga = new Vaga();
        vaga.setTitulo((String) request.get("titulo"));
        vaga.setArea((String) request.get("area"));
        vaga.setSalario((String) request.get("salario"));
        vaga.setTipoTrabalho((String) request.get("tipoTrabalho"));

        vaga.setHabilidades(lerHabilidades(request));

        vagaRepository.save(vaga);
        return ResponseEntity.status(HttpStatus.CREATED).body(Map.of("success", true, "message", "Vaga criada com sucesso.", "vaga", vaga));
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> editarVaga(@PathVariable Long id, @RequestBody Map<String, Object> request) {
        String erro = validarVaga(request, false);
        if (erro != null) {
            return ResponseEntity.badRequest().body(Map.of("success", false, "message", erro));
        }
        Optional<Vaga> vagaOpt = vagaRepository.findById(id);
        if (vagaOpt.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("success", false, "message", "Vaga não encontrada."));
        }

        // O PUT preserva campos omitidos; os valores enviados são validados antes da alteração.
        Vaga vaga = vagaOpt.get();
        if (request.containsKey("titulo")) vaga.setTitulo((String) request.get("titulo"));
        if (request.containsKey("area")) vaga.setArea((String) request.get("area"));
        if (request.containsKey("salario")) vaga.setSalario((String) request.get("salario"));
        if (request.containsKey("tipoTrabalho")) vaga.setTipoTrabalho((String) request.get("tipoTrabalho"));

        if (request.containsKey("habilidades")) {
            java.util.Set<String> habilidades = lerHabilidades(request);
            vaga.getHabilidades().clear();
            vaga.getHabilidades().addAll(habilidades);
        }

        vagaRepository.save(vaga);
        return ResponseEntity.ok(Map.of("success", true, "message", "Vaga atualizada com sucesso.", "vaga", vaga));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deletarVaga(@PathVariable Long id) {
        if (!vagaRepository.existsById(id)) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("success", false, "message", "Vaga não encontrada."));
        }
        vagaRepository.deleteById(id);
        return ResponseEntity.ok(Map.of("success", true, "message", "Vaga excluída com sucesso."));
    }

    @ExceptionHandler(DataAccessException.class)
    public ResponseEntity<?> handleErroPersistencia(DataAccessException exception) {
        logger.error("Erro de persistência da vaga", exception);
        return ResponseEntity.internalServerError().body(Map.of(
                "success", false, "message", "Erro ao salvar ou excluir vaga."));
    }

    private String validarVaga(Map<String, Object> request, boolean criacao) {
        for (String campo : List.of("titulo", "area", "tipoTrabalho")) {
            if (criacao || request.containsKey(campo)) {
                int limite = campo.equals("titulo") ? 100 : 50;
                if (!(request.get(campo) instanceof String valor) || valor.isBlank() || valor.length() > limite) {
                    return campo + " deve ser um texto não vazio de até " + limite + " caracteres.";
                }
            }
        }
        Object salario = request.get("salario");
        if (salario != null && (!(salario instanceof String valor) || valor.length() > 50)) {
            return "Salário deve ser um texto de até 50 caracteres.";
        }
        if (criacao || request.containsKey("habilidades")) {
            if (!(request.get("habilidades") instanceof List<?> habilidades)) {
                return "Habilidades devem ser uma lista de textos.";
            }
            for (Object valor : habilidades) {
                if (!(valor instanceof String habilidade) || habilidade.isBlank() || habilidade.length() > 50) {
                    return "Cada habilidade deve ser um texto não vazio de até 50 caracteres.";
                }
            }
        }
        return null;
    }

    private java.util.Set<String> lerHabilidades(Map<String, Object> request) {
        java.util.Set<String> habilidades = new java.util.HashSet<>();
        for (Object habilidade : (List<?>) request.get("habilidades")) {
            habilidades.add((String) habilidade);
        }
        return habilidades;
    }
}

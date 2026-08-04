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

@RestController
@RequestMapping("/api/admin/vagas")
@Transactional
public class AdminVagaController {

    private final VagaRepository vagaRepository;

    public AdminVagaController(VagaRepository vagaRepository) {
        this.vagaRepository = vagaRepository;
    }

    @PostMapping
    public ResponseEntity<?> criarVaga(@RequestBody Map<String, Object> request) {
        try {
            Vaga vaga = new Vaga();
            vaga.setTitulo((String) request.get("titulo"));
            vaga.setArea((String) request.get("area"));
            vaga.setSalario((String) request.get("salario"));
            vaga.setTipoTrabalho((String) request.get("tipoTrabalho"));
            
            @SuppressWarnings("unchecked")
            List<String> habilidadesList = (List<String>) request.get("habilidades");
            java.util.Set<String> habilidades = new java.util.HashSet<>(habilidadesList);
            vaga.setHabilidades(habilidades);

            vagaRepository.save(vaga);
            return ResponseEntity.status(HttpStatus.CREATED).body(Map.of("success", true, "message", "Vaga criada com sucesso.", "vaga", vaga));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Map.of("success", false, "message", "Erro ao criar vaga."));
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> editarVaga(@PathVariable Long id, @RequestBody Map<String, Object> request) {
        Optional<Vaga> vagaOpt = vagaRepository.findById(id);
        if (vagaOpt.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("success", false, "message", "Vaga não encontrada."));
        }

        try {
            Vaga vaga = vagaOpt.get();
            if (request.containsKey("titulo")) vaga.setTitulo((String) request.get("titulo"));
            if (request.containsKey("area")) vaga.setArea((String) request.get("area"));
            if (request.containsKey("salario")) vaga.setSalario((String) request.get("salario"));
            if (request.containsKey("tipoTrabalho")) vaga.setTipoTrabalho((String) request.get("tipoTrabalho"));
            
            if (request.containsKey("habilidades")) {
                @SuppressWarnings("unchecked")
                List<String> habilidadesList = (List<String>) request.get("habilidades");
                java.util.Set<String> habilidades = new java.util.HashSet<>(habilidadesList);
                vaga.getHabilidades().clear();
                vaga.getHabilidades().addAll(habilidades);
            }

            vagaRepository.save(vaga);
            return ResponseEntity.ok(Map.of("success", true, "message", "Vaga atualizada com sucesso.", "vaga", vaga));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Map.of("success", false, "message", "Erro ao atualizar vaga."));
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deletarVaga(@PathVariable Long id) {
        if (!vagaRepository.existsById(id)) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("success", false, "message", "Vaga não encontrada."));
        }
        try {
            vagaRepository.deleteById(id);
            return ResponseEntity.ok(Map.of("success", true, "message", "Vaga excluída com sucesso."));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Map.of("success", false, "message", "Erro ao excluir vaga."));
        }
    }
}

package com.pointmedia.auth.repository;

import com.pointmedia.auth.model.Candidatura;
import com.pointmedia.auth.model.Usuario;
import com.pointmedia.auth.model.Vaga;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CandidaturaRepository extends JpaRepository<Candidatura, Long> {
    List<Candidatura> findByUsuario(Usuario usuario);
    List<Candidatura> findByVaga(Vaga vaga);
    Optional<Candidatura> findByUsuarioAndVaga(Usuario usuario, Vaga vaga);
    boolean existsByUsuarioAndVaga(Usuario usuario, Vaga vaga);
}

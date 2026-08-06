package com.pointmedia.auth.repository;

import com.pointmedia.auth.model.Curriculo;
import com.pointmedia.auth.model.Usuario;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CurriculoRepository extends JpaRepository<Curriculo, Long> {

    Optional<Curriculo> findByUsuario(Usuario usuario);

    @Query("SELECT DISTINCT c FROM Curriculo c LEFT JOIN c.habilidades h WHERE " +
           "EXISTS (SELECT 1 FROM Candidatura cand WHERE cand.usuario = c.usuario) AND " +
           "(:cargo IS NULL OR LOWER(c.cargo) LIKE LOWER(CONCAT('%', :cargo, '%'))) AND " +
           "(:habilidade IS NULL OR LOWER(h) LIKE LOWER(CONCAT('%', :habilidade, '%')))")
    List<Curriculo> findWithFilters(@Param("cargo") String cargo,
                                    @Param("habilidade") String habilidade);
}

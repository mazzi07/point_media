package com.pointmedia.auth.repository;

import com.pointmedia.auth.model.Vaga;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface VagaRepository extends JpaRepository<Vaga, Long> {
    
    @Query("SELECT v FROM Vaga v WHERE (:area IS NULL OR :area = '' OR :area = 'Todos' OR v.area = :area) " +
           "AND (:busca IS NULL OR :busca = '' OR LOWER(v.titulo) LIKE LOWER(CONCAT('%', :busca, '%')))")
    List<Vaga> findByFiltros(@Param("area") String area, @Param("busca") String busca);
}

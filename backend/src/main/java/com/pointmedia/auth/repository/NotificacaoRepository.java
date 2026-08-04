package com.pointmedia.auth.repository;

import com.pointmedia.auth.model.Notificacao;
import com.pointmedia.auth.model.Usuario;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface NotificacaoRepository extends JpaRepository<Notificacao, Long> {
    List<Notificacao> findByUsuarioOrderByCreatedAtDesc(Usuario usuario);
    long countByUsuarioAndLidaFalse(Usuario usuario);
}

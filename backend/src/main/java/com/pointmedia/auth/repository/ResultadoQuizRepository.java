package com.pointmedia.auth.repository;

import com.pointmedia.auth.model.ResultadoQuiz;
import com.pointmedia.auth.model.Usuario;
import com.pointmedia.auth.model.Quiz;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.Optional;

public interface ResultadoQuizRepository extends JpaRepository<ResultadoQuiz, Long> {
    
    List<ResultadoQuiz> findByUsuario(Usuario usuario);
    Optional<ResultadoQuiz> findByUsuarioAndQuiz(Usuario usuario, Quiz quiz);

    @Query("SELECT r.usuario.id as usuarioId, r.usuario.nome as nome, r.usuario.email as email, " +
           "r.usuario.avatar as avatar, SUM(r.nota) as pontuacaoGeral, COUNT(r.id) as quizzesRealizados, " +
           "AVG(r.acertos) as mediaAcertos " +
           "FROM ResultadoQuiz r GROUP BY r.usuario.id ORDER BY pontuacaoGeral DESC")
    List<Object[]> getRankingGeral();
}

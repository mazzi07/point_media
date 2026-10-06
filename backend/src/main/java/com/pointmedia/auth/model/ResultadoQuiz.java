package com.pointmedia.auth.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "resultados_quiz", uniqueConstraints = @UniqueConstraint(
        name = "uk_resultado_usuario_quiz", columnNames = {"usuario_id", "quiz_id"}))
public class ResultadoQuiz {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "usuario_id", nullable = false)
    private Usuario usuario;

    @ManyToOne
    @JoinColumn(name = "quiz_id", nullable = false)
    private Quiz quiz;

    private Integer nota;
    private Integer acertos;
    // Preserva o percentual histórico mesmo se o número de perguntas mudar depois.
    @Column(name = "total_perguntas", nullable = false)
    private Integer totalPerguntas;
    private Integer tempoGastoSegundos;
    private LocalDateTime dataRealizacao;

    public ResultadoQuiz() {}

    public ResultadoQuiz(Usuario usuario, Quiz quiz, Integer nota, Integer acertos, Integer totalPerguntas, Integer tempoGastoSegundos) {
        this.usuario = usuario;
        this.quiz = quiz;
        this.nota = nota;
        this.acertos = acertos;
        this.totalPerguntas = totalPerguntas;
        this.tempoGastoSegundos = tempoGastoSegundos;
        this.dataRealizacao = LocalDateTime.now();
    }

    public Long getId() { return id; }
    public Usuario getUsuario() { return usuario; }
    public Quiz getQuiz() { return quiz; }
    public Integer getNota() { return nota; }
    public Integer getAcertos() { return acertos; }
    public Integer getTotalPerguntas() { return totalPerguntas; }
    public Integer getTempoGastoSegundos() { return tempoGastoSegundos; }
    public LocalDateTime getDataRealizacao() { return dataRealizacao; }
}

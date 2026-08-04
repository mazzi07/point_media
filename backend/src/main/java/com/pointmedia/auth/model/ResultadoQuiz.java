package com.pointmedia.auth.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "resultados_quiz")
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
    private Integer tempoGastoSegundos;
    private LocalDateTime dataRealizacao;

    public ResultadoQuiz() {}

    public ResultadoQuiz(Usuario usuario, Quiz quiz, Integer nota, Integer acertos, Integer tempoGastoSegundos) {
        this.usuario = usuario;
        this.quiz = quiz;
        this.nota = nota;
        this.acertos = acertos;
        this.tempoGastoSegundos = tempoGastoSegundos;
        this.dataRealizacao = LocalDateTime.now();
    }

    public Long getId() { return id; }
    public Usuario getUsuario() { return usuario; }
    public Quiz getQuiz() { return quiz; }
    public Integer getNota() { return nota; }
    public Integer getAcertos() { return acertos; }
    public Integer getTempoGastoSegundos() { return tempoGastoSegundos; }
    public LocalDateTime getDataRealizacao() { return dataRealizacao; }
}

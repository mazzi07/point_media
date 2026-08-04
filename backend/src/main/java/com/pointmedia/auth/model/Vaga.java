package com.pointmedia.auth.model;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "vagas")
public class Vaga {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String titulo;

    @Column(name = "tipo_trabalho")
    private String tipoTrabalho; // Remoto, Presencial, Hibrido

    private String salario; // Ex: "R$ 5.000 - 8.000"

    private String area; // Ex: "Design", "Desenvolvimento"
    
    @ElementCollection(fetch = FetchType.EAGER)
    @CollectionTable(name = "vaga_habilidades", joinColumns = @JoinColumn(name = "vaga_id"))
    @Column(name = "habilidade")
    private java.util.Set<String> habilidades;

    @Column(name = "data_criacao")
    private LocalDateTime dataCriacao;

    @PrePersist
    protected void onCreate() {
        dataCriacao = LocalDateTime.now();
    }

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getTitulo() { return titulo; }
    public void setTitulo(String titulo) { this.titulo = titulo; }
    public String getTipoTrabalho() { return tipoTrabalho; }
    public void setTipoTrabalho(String tipoTrabalho) { this.tipoTrabalho = tipoTrabalho; }
    public String getSalario() { return salario; }
    public void setSalario(String salario) { this.salario = salario; }
    public String getArea() { return area; }
    public void setArea(String area) { this.area = area; }
    public java.util.Set<String> getHabilidades() { return habilidades; }
    public void setHabilidades(java.util.Set<String> habilidades) { this.habilidades = habilidades; }
    public LocalDateTime getDataCriacao() { return dataCriacao; }
    public void setDataCriacao(LocalDateTime dataCriacao) { this.dataCriacao = dataCriacao; }
}

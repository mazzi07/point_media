-- Tabela de Vagas
CREATE TABLE IF NOT EXISTS vagas (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    titulo VARCHAR(100) NOT NULL,
    tipo_trabalho VARCHAR(50) NOT NULL,
    salario VARCHAR(50),
    area VARCHAR(50) NOT NULL,
    data_criacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS vaga_habilidades (
    vaga_id BIGINT NOT NULL,
    habilidade VARCHAR(50) NOT NULL,
    FOREIGN KEY (vaga_id) REFERENCES vagas(id) ON DELETE CASCADE
);

-- INSERÇÕES INICIAIS (SEED)

-- 1. Conta Admin
-- Senha: admin123 (Criptografada via BCrypt)
INSERT INTO usuarios (nome, email, senha_hash, tipo_usuario) 
SELECT 'Admin Point Media', 'admin@pointmedia.com', '$2a$10$D8bJ/G2oV.fIInU9K0L.9e9K4X6/U.E5lA6n/r/W6H//vO1B5H.Ie', 'ADMIN'
WHERE NOT EXISTS (SELECT 1 FROM usuarios WHERE email = 'admin@pointmedia.com');

-- 2. Vagas Mock
INSERT IGNORE INTO vagas (id, titulo, tipo_trabalho, salario, area) VALUES 
(1, 'Desenvolvedor Full Stack', 'Remoto', 'R$ 5.000 - 8.000', 'Desenvolvimento'),
(2, 'UI/UX Designer Júnior', 'Híbrido', 'R$ 3.000 - 4.500', 'Design'),
(3, 'Analista de Marketing Digital', 'Presencial', 'R$ 3.500 - 5.000', 'Marketing'),
(4, 'Desenvolvedor Frontend', 'Remoto', 'R$ 4.000 - 6.000', 'Desenvolvimento');

INSERT IGNORE INTO vaga_habilidades (vaga_id, habilidade) VALUES
(1, 'React'), (1, 'Node.js'), (1, 'TypeScript'),
(2, 'Figma'), (2, 'Illustrator'), (2, 'UX Research'),
(3, 'Google Ads'), (3, 'SEO'), (3, 'Analytics'),
(4, 'Vue.js'), (4, 'CSS'), (4, 'JavaScript');

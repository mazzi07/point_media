-- Script de migração V3: Adiciona as tabelas do ecossistema de Quizzes e insere dados iniciais

CREATE TABLE IF NOT EXISTS quizzes (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    titulo VARCHAR(255) NOT NULL,
    descricao TEXT,
    categoria VARCHAR(255),
    nivel VARCHAR(50),
    tempo_minutos INT
);

CREATE TABLE IF NOT EXISTS perguntas (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    quiz_id BIGINT NOT NULL,
    texto TEXT NOT NULL,
    FOREIGN KEY (quiz_id) REFERENCES quizzes(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS alternativas (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    pergunta_id BIGINT NOT NULL,
    texto TEXT NOT NULL,
    correta BOOLEAN NOT NULL DEFAULT FALSE,
    FOREIGN KEY (pergunta_id) REFERENCES perguntas(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS resultados_quiz (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    usuario_id BIGINT NOT NULL,
    quiz_id BIGINT NOT NULL,
    nota INT NOT NULL,
    acertos INT NOT NULL,
    tempo_gasto_segundos INT,
    data_realizacao DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE,
    FOREIGN KEY (quiz_id) REFERENCES quizzes(id) ON DELETE CASCADE
);

-- ==========================================================
-- Inserindo Quizzes Mockados Iniciais (Vagas de frontend e backend)
-- ==========================================================

-- Quiz 1: React.js Fundamentals
INSERT INTO quizzes (id, titulo, descricao, categoria, nivel, tempo_minutos) VALUES 
(1, 'React.js Fundamentals', 'Teste seus conhecimentos básicos em React e seus principais conceitos.', 'Desenvolvimento Frontend', 'Iniciante', 10);

-- Perguntas do Quiz 1
INSERT INTO perguntas (id, quiz_id, texto) VALUES 
(1, 1, 'O que é um Hook no React?'),
(2, 1, 'Para que serve o useEffect?'),
(3, 1, 'Qual a diferença entre estado (state) e propriedades (props)?');

-- Alternativas P1
INSERT INTO alternativas (pergunta_id, texto, correta) VALUES 
(1, 'Um anzol para pescar componentes.', FALSE),
(1, 'Uma função especial que permite usar estado e outros recursos do React sem escrever uma classe.', TRUE),
(1, 'Um componente estilizado.', FALSE),
(1, 'Uma nova forma de escrever HTML.', FALSE);

-- Alternativas P2
INSERT INTO alternativas (pergunta_id, texto, correta) VALUES 
(2, 'Para adicionar CSS inline.', FALSE),
(2, 'Para buscar elementos no DOM virtual.', FALSE),
(2, 'Para realizar efeitos colaterais em componentes funcionais (ex: fetch de dados, assinaturas).', TRUE),
(2, 'Para manipular o histórico de rotas.', FALSE);

-- Alternativas P3
INSERT INTO alternativas (pergunta_id, texto, correta) VALUES 
(3, 'Props são mutáveis e State é imutável.', FALSE),
(3, 'State é gerenciado internamente pelo componente e Props são passadas de pai para filho.', TRUE),
(3, 'Não existe diferença, são sinônimos.', FALSE),
(3, 'Props são para classes e State para componentes funcionais.', FALSE);


-- Quiz 2: JavaScript Avançado
INSERT INTO quizzes (id, titulo, descricao, categoria, nivel, tempo_minutos) VALUES 
(2, 'JavaScript Avançado', 'Teste seus conhecimentos em conceitos avançados de JavaScript.', 'Programação', 'Avançado', 15);

-- Perguntas Quiz 2
INSERT INTO perguntas (id, quiz_id, texto) VALUES 
(4, 2, 'Qual das alternativas melhor descreve o conceito de hoisting no JavaScript?'),
(5, 2, 'O que é Closure?');

-- Alternativas P4
INSERT INTO alternativas (pergunta_id, texto, correta) VALUES 
(4, 'A. É quando uma função é executada antes de ser declarada.', FALSE),
(4, 'B. É o comportamento onde declarações de variáveis e funções são movidas para o topo do seu escopo antes da execução do código.', TRUE),
(4, 'C. É a prática de importar módulos antes de usá-los no código.', FALSE),
(4, 'D. É quando o JavaScript ignora erros e continua executando o código.', FALSE);

-- Alternativas P5
INSERT INTO alternativas (pergunta_id, texto, correta) VALUES 
(5, 'O fechamento automático de tags HTML pelo JS.', FALSE),
(5, 'A combinação de uma função empacotada (encerrada) com referências ao seu estado léxico circundante.', TRUE),
(5, 'Um loop que nunca termina.', FALSE),
(5, 'O bloqueio de variáveis globais.', FALSE);


-- Quiz 3: Marketing Digital Strategy
INSERT INTO quizzes (id, titulo, descricao, categoria, nivel, tempo_minutos) VALUES 
(3, 'Marketing Digital Strategy', 'Avalie seus conhecimentos em estratégias e ferramentas de marketing digital.', 'Marketing', 'Intermediário', 12);

-- Perguntas Quiz 3
INSERT INTO perguntas (id, quiz_id, texto) VALUES 
(6, 3, 'O que significa SEO?'),
(7, 3, 'Qual a principal vantagem do Inbound Marketing?');

-- Alternativas P6
INSERT INTO alternativas (pergunta_id, texto, correta) VALUES 
(6, 'Search Engine Optimization (Otimização para Motores de Busca).', TRUE),
(6, 'System Engineering Operation.', FALSE),
(6, 'Site Event Organiser.', FALSE),
(6, 'Social Engagement Online.', FALSE);

-- Alternativas P7
INSERT INTO alternativas (pergunta_id, texto, correta) VALUES 
(7, 'Garantir vendas imediatas e sem esforço.', FALSE),
(7, 'Atrair clientes potenciais por meio de conteúdo relevante, em vez de interrompê-los com anúncios agressivos.', TRUE),
(7, 'Focar exclusivamente em panfletagem digital.', FALSE),
(7, 'Substituir toda a equipe de vendas por robôs.', FALSE);

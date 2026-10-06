-- Não remove resultados históricos. Duplicados fazem este primeiro ALTER
-- falhar com "Duplicate entry" e o nome uk_resultado_usuario_quiz.
-- Preflight do operador: verifique duplicados antes de aplicar V9.
-- SELECT usuario_id, quiz_id, COUNT(*) AS quantidade FROM resultados_quiz
-- GROUP BY usuario_id, quiz_id HAVING COUNT(*) > 1;
-- DDL do MySQL pode manter ALTERs anteriores se uma instrução posterior falhar.
-- Uma falha parcial pode exigir reconciliação manual do schema e flyway repair
-- antes de tentar novamente; repair não desfaz alterações no schema.
ALTER TABLE resultados_quiz
    ADD CONSTRAINT uk_resultado_usuario_quiz UNIQUE (usuario_id, quiz_id);

ALTER TABLE resultados_quiz ADD COLUMN total_perguntas INT NULL;

-- Não há snapshot anterior: o tamanho atual é o melhor backfill disponível.
-- Quizzes sem perguntas recebem zero; os cálculos protegem esse denominador.
UPDATE resultados_quiz r
LEFT JOIN (
    SELECT quiz_id, COUNT(*) AS total
    FROM perguntas
    GROUP BY quiz_id
) p ON p.quiz_id = r.quiz_id
SET r.total_perguntas = COALESCE(p.total, 0);

ALTER TABLE resultados_quiz MODIFY COLUMN total_perguntas INT NOT NULL;

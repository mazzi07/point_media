-- Atualiza a senha do admin para 'admin123'
UPDATE usuarios 
SET senha_hash = '$2a$10$96euxz0XMJLw9cuTZENo9.36rfQGkfmefJ8vlpJG8SI0V9MPlGthq' 
WHERE email = 'admin@pointmedia.com';

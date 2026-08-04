-- Script de migração V4: Adiciona a coluna avatar na tabela usuarios
ALTER TABLE usuarios ADD COLUMN avatar MEDIUMTEXT;

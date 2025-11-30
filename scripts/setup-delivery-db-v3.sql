-- Atualização para adicionar campo de saída
USE delivery_system;

-- Adicionar coluna saida à tabela de entregas
ALTER TABLE deliveries ADD COLUMN saida INT NOT NULL DEFAULT 1 AFTER dataContratacao;

-- Adicionar índice para melhor performance com agrupamento por saída
CREATE INDEX idx_user_saida ON deliveries(user_id, saida);

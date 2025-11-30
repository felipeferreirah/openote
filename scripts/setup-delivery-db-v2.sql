-- Atualizar banco de dados com suporte a autenticação
USE delivery_system;

-- Tabela de usuários
CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  email VARCHAR(255) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  name VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Adicionar coluna user_id à tabela de entregas
ALTER TABLE deliveries ADD COLUMN user_id INT NOT NULL DEFAULT 1;
ALTER TABLE deliveries ADD FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE;

-- Adicionar índices para melhor performance com filtros
CREATE INDEX idx_user_data ON deliveries(user_id, dataContratacao);
CREATE INDEX idx_user_id ON deliveries(user_id);

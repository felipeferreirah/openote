-- Criar novo banco de dados
CREATE DATABASE IF NOT EXISTS delivery_system;
USE delivery_system;

-- Tabela de entregas
CREATE TABLE IF NOT EXISTS deliveries (
  id INT AUTO_INCREMENT PRIMARY KEY,
  dataContratacao DATE NOT NULL,
  transportador VARCHAR(255) NOT NULL,
  motorista VARCHAR(255) NOT NULL,
  placa VARCHAR(20) NOT NULL,
  nfVenda VARCHAR(50) NOT NULL,
  cliente VARCHAR(255) NOT NULL,
  cidade VARCHAR(255) NOT NULL,
  valorPedagio DECIMAL(10, 2) NOT NULL DEFAULT 0,
  valorDescarga DECIMAL(10, 2) NOT NULL DEFAULT 0,
  valorFrete DECIMAL(10, 2) NOT NULL DEFAULT 0,
  caixas INT NOT NULL DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Índices para melhor performance
CREATE INDEX idx_cliente ON deliveries(cliente);
CREATE INDEX idx_cidade ON deliveries(cidade);
CREATE INDEX idx_placa ON deliveries(placa);
CREATE INDEX idx_data ON deliveries(dataContratacao);

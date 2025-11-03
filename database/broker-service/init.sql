DROP DATABASE IF EXISTS andina_brokers;
CREATE DATABASE andina_brokers CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci;
USE andina_brokers;

-- Tabla principal de comisionistas
CREATE TABLE brokers (
  id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
  user_id CHAR(36) NOT NULL,            -- ID del usuario en el servicio Auth
  name VARCHAR(120) NOT NULL,
  license_number VARCHAR(50) NOT NULL UNIQUE,
  email VARCHAR(120) NOT NULL,
  phone VARCHAR(30),
  status ENUM('active','suspended') DEFAULT 'active',
  created_at DATETIME(3) DEFAULT CURRENT_TIMESTAMP(3)
);

-- Órdenes ejecutadas por broker
CREATE TABLE broker_orders (
  id INT AUTO_INCREMENT PRIMARY KEY,
  broker_id CHAR(36) NOT NULL,
  investor_id CHAR(36) NOT NULL,
  stock_ticker VARCHAR(20) NOT NULL,
  side ENUM('buy','sell') NOT NULL,
  qty INT NOT NULL,
  executed_price DECIMAL(12,2) NOT NULL,
  executed_at DATETIME(3) NOT NULL,
  FOREIGN KEY (broker_id) REFERENCES brokers(id)
    ON DELETE CASCADE ON UPDATE CASCADE
);

-- Consulta rápida
SELECT * FROM brokers;
SELECT * FROM broker_orders;
DROP TABLE IF EXISTS portfolio_orders;
CREATE TABLE portfolio_orders (
  id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
  investor_id CHAR(36) NOT NULL,
  broker_id CHAR(36) NULL,
  ticker VARCHAR(20) NOT NULL,
  qty INT NOT NULL CHECK (qty > 0),
  type ENUM('market','limit') DEFAULT 'market',
  side ENUM('buy','sell') NOT NULL,
  requested_price DECIMAL(12,2) DEFAULT NULL,
  status ENUM('pending','approved','executed','rejected') DEFAULT 'pending',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);


-- 2) Tabla de posiciones
DROP DATABASE IF EXISTS andina_portfolio;
CREATE DATABASE andina_portfolio CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE andina_portfolio;

-- ======= Tabla principal de órdenes =======
CREATE TABLE portfolio_orders (
  id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
  investor_id CHAR(36) NOT NULL,        -- ID del inversionista (referenciado por API)
  broker_id CHAR(36) NULL,              -- ID del broker (referenciado por API)
  ticker VARCHAR(20) NOT NULL,
  qty INT NOT NULL CHECK (qty > 0),
  type ENUM('market','limit') DEFAULT 'market',
  side ENUM('buy','sell') NOT NULL,
  requested_price DECIMAL(12,2) DEFAULT NULL,
  status ENUM('pending','approved','executed','rejected') DEFAULT 'pending',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- ======= Posiciones actuales del inversionista =======
CREATE TABLE positions (
  id INT AUTO_INCREMENT PRIMARY KEY,
  investor_id CHAR(36) NOT NULL,       -- ID referencial del inversionista
  ticker VARCHAR(20) NOT NULL,
  qty INT NOT NULL,
  avg_price DECIMAL(12,2) NOT NULL,
  last_updated DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE KEY uq_investor_ticker (investor_id, ticker)
);

-- ======= Auditoría de cambios =======
CREATE TABLE order_audit (
  id INT AUTO_INCREMENT PRIMARY KEY,
  order_id CHAR(36) NOT NULL,
  event ENUM('created','approved','executed','cancelled','rejected') NOT NULL,
  event_by CHAR(36) NULL,s
  notes VARCHAR(255) NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

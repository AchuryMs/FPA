DROP DATABASE IF EXISTS andina_orders;
CREATE DATABASE IF NOT EXISTS andina_orders
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;
USE andina_orders;

CREATE TABLE orders (
  id CHAR(36) NOT NULL PRIMARY KEY DEFAULT (UUID()),    -- UUID generado en MySQL
  investor_id CHAR(36) NULL default 'probando',
  broker_id CHAR(36) NULL default 'probando',
  
  ticker VARCHAR(10) NOT NULL,                          -- AAPL, TSLA, etc
  side ENUM('buy','sell') NOT NULL,                     -- tipo de orden
  qty INT NOT NULL CHECK (qty > 0),                     -- número de acciones
  type ENUM('market','limit') NOT NULL,                 -- tipo de orden
  status ENUM('new','partially_filled','filled','cancelled') 
        NOT NULL DEFAULT 'new',                         -- ciclo de vida
  order_date DATE NOT NULL,
  -- fecha (sin hora)
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

  INDEX idx_orders_investor (investor_id),
  INDEX idx_orders_ticker (ticker)
);

select * from andina_orders.orders;


CREATE TABLE trades (
  id CHAR(36) NOT NULL PRIMARY KEY,
  order_id CHAR(36) NOT NULL,
  ticker VARCHAR(10) NOT NULL,
  qty INT NOT NULL CHECK (qty > 0),
  price_cents INT NOT NULL CHECK (price_cents >= 0),
  executed_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_trades_order FOREIGN KEY (order_id)
    REFERENCES orders(id)
    ON DELETE CASCADE,
    
  INDEX idx_trades_ticker (ticker)
);

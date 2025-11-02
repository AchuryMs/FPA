-- =========================================================
--  Esquema base para Auth (MySQL 8 / Workbench)
--  JWT se firma en el servicio; aquí solo almacenamos hashes.
-- =========================================================
-- 1) Base de datos y configuración
DROP DATABASE IF EXISTS andina_contracts;
CREATE DATABASE IF NOT EXISTS andina_contracts
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_0900_ai_ci;
USE andina_contracts;

CREATE TABLE IF NOT EXISTS investors (
  user_id CHAR(36) PRIMARY KEY NOT NULL,
  created_at DATETIME(3) DEFAULT CURRENT_TIMESTAMP(3)
);

CREATE TABLE IF NOT EXISTS brokers (
  user_id CHAR(36) PRIMARY KEY NOT NULL,
  created_at DATETIME(3) DEFAULT CURRENT_TIMESTAMP(3)
);

CREATE TABLE IF NOT EXISTS Contracts (
  investor_id CHAR(36) NOT NULL,
  broker_id   CHAR(36) NOT NULL,
  status       ENUM('active','suspended','terminated') NOT NULL DEFAULT 'active',
  signed_at    DATETIME(3) NOT NULL,
  effective_from DATE     NOT NULL,
  effective_to   DATE     NULL,
  terminated_at  DATETIME(3) NULL,
  
  created_at  DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  updated_at  DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),

  INDEX idx_contracts (investor_id, broker_id),

  FOREIGN KEY (investor_id) REFERENCES investors(user_id)
    ON DELETE CASCADE
    ON UPDATE CASCADE,

  FOREIGN KEY (broker_id) REFERENCES brokers(user_id)
    ON DELETE CASCADE
    ON UPDATE CASCADE
) ENGINE=InnoDB;

select * from andina_contracts.brokers;
select * from andina_contracts.investors;
select * from andina_contracts.contracts;

INSERT INTO andina_contracts.contracts (
  investor_id,
  broker_id,
  status,
  signed_at,
  effective_from,
  effective_to,
  terminated_at
  
) VALUES (
  'cb77066c-b840-11f0-992f-0a0027000007',  -- debe existir en investors(id)
  'cb778818-b840-11f0-992f-0a0027000007', -- debe existir en brokers(id)
  'active',
  '2025-11-02 10:30:00.000',
  '2025-11-03',
  '2026-11-03',
  NULL
);



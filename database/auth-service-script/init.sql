-- =========================================================
--  Esquema base para Auth (MySQL 8 / Workbench)
--  JWT se firma en el servicio; aquí solo almacenamos hashes.
-- =========================================================
-- 1) Base de datos y configuración
DROP DATABASE IF EXISTS andina_auth;
CREATE DATABASE IF NOT EXISTS andina_auth
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_0900_ai_ci;
USE andina_auth;

-- 2) Tabla de usuarios
--    - id: UUID en texto para simplicidad (CHAR(36))
--    - email_lower: columna generada para índice único case-insensitive
--    - password_hash: guarda el hash resultante (bcrypt/argon2id) generado en la APP
--    - password_algo: por si cambias algoritmo a futuro (migraciones)
--    - status: básico (active/blocked/pending)
CREATE TABLE IF NOT EXISTS users (
  id                CHAR(36)       NOT NULL PRIMARY KEY DEFAULT (UUID()),
  email             VARCHAR(320)   NOT NULL,
  email_lower       VARCHAR(320)   AS (LOWER(email)) STORED,
  full_name         VARCHAR(200)   NULL,
  user_type         ENUM('investor','broker','admin','analyst','service')
                    NOT NULL DEFAULT 'investor',
  password_hash     VARCHAR(255)   NOT NULL,  -- bcrypt/argon2id hash generado en la app
  password_algo     ENUM('bcrypt','argon2id') NOT NULL DEFAULT 'bcrypt',
  status            ENUM('active','blocked','pending') NOT NULL DEFAULT 'active',
  last_login_at     DATETIME(3)    NULL,
  created_at        DATETIME(3)    NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  updated_at        DATETIME(3)    NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
  CONSTRAINT uq_users_email_lower UNIQUE (email_lower),
  CONSTRAINT ck_users_email_format CHECK (email LIKE '%_@_%._%')
) ENGINE=InnoDB;

/**select * from users;
select * from investors;
select * from auth_login_attempt;
truncate table  auth_login_attempt;
delete from users where email in( 'Andres@cuta.com','usuario@ejemplo.com');**/

-- 3) Intentos de login (auditoría simple / antifraude)
CREATE TABLE IF NOT EXISTS auth_login_attempt (
  id                  CHAR(36)      NOT NULL PRIMARY KEY DEFAULT (UUID()),
  user_id             CHAR(36)      NULL,
  username_submitted  VARCHAR(320)  NOT NULL,
  success             BOOLEAN       NOT NULL,
  reason              VARCHAR(50)   NULL, -- 'invalid_password','not_found','blocked', etc.
  ip                  VARCHAR(45)   NULL, -- IPv4/IPv6 textual
  user_agent          VARCHAR(400)  NULL,
  created_at          DATETIME(3)   NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  CONSTRAINT fk_attempt_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
) ENGINE=InnoDB;

CREATE INDEX ix_attempt_user     ON auth_login_attempt (user_id);
CREATE INDEX ix_attempt_created  ON auth_login_attempt (created_at);

CREATE TABLE IF NOT EXISTS Contracts (

  id          CHAR(36)  NOT NULL DEFAULT (UUID()),
  investor_id CHAR(36)  NOT NULL,
  broker_id   CHAR(36)  NOT NULL,
  status       ENUM('active','suspended','terminated') NOT NULL DEFAULT 'active',
  signed_at    DATETIME(3) NOT NULL,
  effective_from DATE     NOT NULL,
  effective_to   DATE     NULL,
  terminated_at  DATETIME(3) NULL,
  
  created_at  DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  updated_at  DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),

  PRIMARY KEY (id)

) ENGINE=InnoDB;




-- =========================================================
--  INSERTS de ejemplo (opcional)
--  Recuerda: genera el HASH en tu servicio (bcrypt/argon2id).
--  EJEMPLO: bcrypt ficticio (NO válido): '$2b$12$abcdefghijklmnopqrstuvC2f9b0m1QFJq9lW1u9s8'
-- =========================================================

-- INSERT INTO users (email, full_name, password_hash, password_algo)
-- VALUES ('admin@andina.local', 'Admin Demo', '$2b$12$pon_aqui_el_hash_bcrypt_valido', 'bcrypt');

-- =========================================================
--  NOTAS DE USO DESDE TU SERVICIO
-- =========================================================
-- Registro:
--   1) Genera hash en la app (bcrypt/argon2id) con salt interno del algoritmo.
--   2) INSERT en users(email, full_name, password_hash, password_algo)

-- Login:
--   1) SELECT * FROM users WHERE email_lower = LOWER(?) AND status='active'
--   2) Verifica el password contra password_hash en la app (bcrypt.compare/argon2.verify)
--   3) Si OK: UPDATE users SET last_login_at=NOW(3) WHERE id=?
--   4) Inserta en auth_login_attempt (success=1 / 0 según corresponda)
--   5) Genera y firma el JWT de acceso en tu servicio (HS256/RS256/ECDSA)

CREATE DATABASE IF NOT EXISTS andina_payment;
USE andina_payment;

CREATE TABLE payments (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,
  investor_id BIGINT NOT NULL,
  amount DECIMAL(12,2) NOT NULL,
  currency CHAR(3) DEFAULT 'USD',
  type ENUM('deposit','withdraw') NOT NULL,
  stripe_id VARCHAR(80),
  status ENUM('pending','approved','rejected') DEFAULT 'approved',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
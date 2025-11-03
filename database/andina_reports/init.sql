CREATE DATABASE IF NOT EXISTS andina_report;
USE andina_report;

-- Tabla principal de auditoría de reportes
CREATE TABLE report_logs (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,
  investor_id BIGINT NULL,
  report_type ENUM('summary','portfolio','performance','contracts') NOT NULL,
  status ENUM('success','error') DEFAULT 'success',
  message VARCHAR(255),
  generated_by VARCHAR(100) DEFAULT 'system',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla opcional para registrar tiempo de respuesta o métricas
CREATE TABLE report_metrics (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,
  report_type ENUM('summary','portfolio','performance','contracts') NOT NULL,
  total_time_ms INT NOT NULL,
  endpoint VARCHAR(200),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
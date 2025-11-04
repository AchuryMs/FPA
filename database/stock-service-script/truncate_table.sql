USE andina_orders;
TRUNCATE TABLE orders;

ALTER TABLE orders
MODIFY COLUMN investor_id VARCHAR(50) NOT NULL;
USE andina_contracts;

INSERT INTO investors (user_id) VALUES ('<INVESTOR_ID>');
INSERT INTO brokers (user_id) VALUES ('<BROKER_ID>');

INSERT INTO contracts (investor_id, broker_id, status, signed_at, effective_from, effective_to)
VALUES ('<INVESTOR_ID>', '<BROKER_ID>', 'active', NOW(), CURDATE(), DATE_ADD(CURDATE(), INTERVAL 1 YEAR));
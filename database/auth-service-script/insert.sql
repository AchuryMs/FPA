USE andina_auth;

-- Inversionista
INSERT INTO users (email, full_name, user_type, password_hash, status)
VALUES ('inversionista@demo.com', 'Inversionista Demo', 'investor', '$2b$10$hdzfzn/ZvU9AC.Et0rTZTO5YRtGXsB7U6chgBJzJeavENEDGtv6aK', 'active');

-- Broker
INSERT INTO users (email, full_name, user_type, password_hash, status)
VALUES ('broker@demo.com', 'Broker Demo', 'broker', '$2b$10$hdzfzn/ZvU9AC.Et0rTZTO5YRtGXsB7U6chgBJzJeavENEDGtv6aK', 'active');

SELECT id, email, user_type FROM users;
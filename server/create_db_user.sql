-- ====================================================================
-- MySQL Setup — run these commands as root BEFORE schema.sql/seed.sql
-- ====================================================================

-- Create the database
CREATE DATABASE IF NOT EXISTS airbnb_db
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

-- Create a dedicated least-privilege app user
-- Replace 'SolsticeSanctuary2025!' with your own strong password.
CREATE USER IF NOT EXISTS 'airbnb_app'@'localhost'
  IDENTIFIED BY 'SolsticeSanctuary2025!';

-- Grant only what the app needs — never GRANT ALL or GRANT OPTION
GRANT SELECT, INSERT, UPDATE, DELETE
  ON airbnb_db.*
  TO 'airbnb_app'@'localhost';

FLUSH PRIVILEGES;

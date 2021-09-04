-- Destroy existing dev and test database environments
DROP DATABASE IF EXISTS chatapp_development;
DROP ROLE IF EXISTS chatapp_development_admin;
DROP DATABASE IF EXISTS chatapp_test;
DROP ROLE IF EXISTS chatapp_test_admin;

-- Create database dev environment
CREATE DATABASE chatapp_development;
CREATE ROLE chatapp_development_admin WITH LOGIN PASSWORD 'chatapp_development_password' SUPERUSER;
GRANT ALL PRIVILEGES ON DATABASE chatapp_development TO chatapp_development_admin;

-- Create database test environment
CREATE DATABASE chatapp_test;
CREATE ROLE chatapp_test_admin WITH LOGIN PASSWORD 'chatapp_test_password' SUPERUSER;
GRANT ALL PRIVILEGES ON DATABASE chatapp_test TO chatapp_test_admin;

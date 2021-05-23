-- For development purposes
CREATE DATABASE chatapp_development;
CREATE ROLE chatapp_development_admin WITH LOGIN PASSWORD 'chatapp_development_password';
GRANT ALL PRIVILEGES ON DATABASE chatapp_development TO chatapp_development_admin;

-- For testing purposes
CREATE DATABASE chatapp_test;
CREATE ROLE chatapp_test_admin WITH LOGIN PASSWORD 'chatapp_test_password';
GRANT ALL PRIVILEGES ON DATABASE chatapp_test TO chatapp_test_admin;

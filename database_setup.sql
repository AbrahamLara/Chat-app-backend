-- For development purposes
CREATE DATABASE chatapp_api_development;
CREATE ROLE chatapp_admin_development WITH LOGIN PASSWORD 'chatapp_development';
GRANT ALL PRIVILEGES ON DATABASE chatapp_api_development TO chatapp_admin_development;

-- For testing purposes
CREATE DATABASE chatapp_api_test;
CREATE ROLE chatapp_admin_test WITH LOGIN PASSWORD 'chatapp_test';
GRANT ALL PRIVILEGES ON DATABASE chatapp_api_test TO chatapp_admin_test;

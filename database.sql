DROP DATABASE IF EXISTS chatapp;
DROP ROLE IF EXISTS chatapp;
-- Comment the next line so that you only drop the database and role that was created for this project.
CREATE DATABASE chatapp; CREATE ROLE chatapp WITH LOGIN PASSWORD 'chatapp';

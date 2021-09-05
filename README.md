# Chat App Backend
The Chat App backend for the frontend project [chat-app-frontend](https://github.com/AbrahamLara/Chat-App). This
project holds the Chat App api for authenticating users and allowing for various user related actions.

This project doesn't require you having to download PostgreSQL on your machine since it's using PostgreSQL docker image.

## Requirements
* NodeJS
* Docker

## Project setup
Run these commands to get started:
* `npm run install` - install dependencies (for local development)
* `docker-compose run web npm run setup` - create models, insert fake data, etc.
* `docker-compose up` - start database and web service to begin development

You should now be able to make calls to your local server and play with the database. 

### Accessing PostgreSQL
Run these commands in order to access the ChatApp databases created in the db service:
* `docker exec -it chat-app-backend_db_1 /bin/sh` – access the container's interactive terminal
* `su - postgres` – switch to the postgres user
* `psql chatapp_developmemt` – log into the PSQL client and access the development database
  * `psql chatapp_test` – to access the test database for unit testing

To exit the postgres interactive terminal run the command `\q`, then run `exit` twice.

## Notes 
* Without `babel-runtime` typescript throws `Cannot find module 'babel-runtime/helpers/extends'` when attempting to 
  compile `jwt-token-encrypted`.

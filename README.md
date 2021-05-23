# Chat App Backend
The Chat App backend for the frontend project [chat-app-frontend](https://github.com/AbrahamLara/Chat-App). This 
project holds the Chat App api for authenticating users and allowing for various user related actions.

This project doesn't require you having a running/downloaded PostgreSQL server on your machine since it's using docker.

## Requirements
* NodeJS
* Docker

## Project setup
Install project dependencies (for local development):
* `npm run install`

Run migrations before running server:
* `docker-compose run web npm run migrations`

The first time you run this command docker will begin creating the images and container for this project before running
migrations. Scripts that depend on a running service should be run using `docker-compose run web` like the command 
above to run migrations.

Start the server and database locally:
* `docker-compose up`

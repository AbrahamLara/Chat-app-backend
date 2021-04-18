# Chat App Backend

The backend for the frontend project [chat-app-frontend](https://github.com/AbrahamLara/Chat-App).

## Requirements
* NodeJS
* TypeScript
* Sequelize
* PostgreSQL

## Database setup
These instructions assume PostgreSQL has been installed and the `psql` has been set up for use.

* Run PostgreSQL
* Setup: `psql -h 127.0.0.1 -f database_setup.sql`

**Note:** `psql` is an alias for the absolute path of the cli that comes with installing PostgreSQL. Here are links to 
help set it up. However, it's not necessary, so if you don't want to set it up you can just click on the links 
provided in order to know what the absolute path should look like in order to run the setup and destroy sql script.
* [Windows](https://sqlbackupandftp.com/blog/setting-windows-path-for-postgres-tools)
* [macOS](https://postgresapp.com/)

### Undoing database setup
* Destroy: `psql -h 127.0.0.1 -f database_destroy.sql`

## Project setup
* Install packages: `npm run install`
* Create database models: `npm run migrations`
* Run server `npm run dev`;

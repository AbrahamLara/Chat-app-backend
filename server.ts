import http from 'http';
import express from 'express';
import auth from './api/auth';

// const { NODE_ENV } = process.env;

/**
 * In order to unit test requests to the server, we need to create this function that will help in creating unique
 * instances of the server for each unit test.
 */
function createServer(): http.Server {
  const app = express();

  app.use(express.json());
  // api routes
  app.use('/api/auth', auth);

  return http.createServer(app);
}

export { createServer };

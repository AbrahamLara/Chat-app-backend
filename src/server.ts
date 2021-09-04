import cors from 'cors';
import http from 'http';
import express from 'express';
import authApi from './api/auth-api';
import searchApi from './api/search-api';

/**
 * In order to unit test requests to the server, we need to create this function that will help in creating unique
 * instances of the server for each unit test.
 */
function createServer(): http.Server {
  const app = express();

  // Enable cors
  app.use(cors());

  app.use(express.json());

  // api routes
  app.use('/api/auth', authApi);
  app.use('/api/search', searchApi);

  return http.createServer(app);
}

export { createServer };

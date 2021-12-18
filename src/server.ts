import cors from 'cors';
import http from 'http';
import express from 'express';
import authApi from './api/auth-api';
import searchApi from './api/search-api';

/**
 * Creates a server instance for reuse. This also helps with creating different server instances for unit tests.
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

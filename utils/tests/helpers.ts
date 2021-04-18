import { Server } from 'http';

/**
 * Creates a unique server instance for each unit test.
 */
function createTestServer(): Server {
  // Delete the internal cache Node.js creates for modules to create unique instances of the server for each test.
  delete require.cache[require.resolve('../../server')];
  // eslint-disable-next-line global-require
  return require('../../server').createServer();
}

export { createTestServer };

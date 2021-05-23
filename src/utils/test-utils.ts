import { Server } from 'http';
import { LoginFormFields, RegisterFormFields } from './auth-utils';

export const TEST_SERVER_PORT = 5001;

// A public token from https://jwt.io/ for testing purposes.
export const MOCK_JWT =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c';

export const MOCK_HASH = 'MOCK_HASH';

export const MOCK_LOGIN_FORM: LoginFormFields = {
  email: 'test1@test.test',
  password: 'Testing1!',
};

export const MOCK_REGISTER_FORM: RegisterFormFields = {
  ...MOCK_LOGIN_FORM,
  name: 'Test User',
  confPassword: MOCK_LOGIN_FORM.password,
};

/**
 * Creates a unique server instance for each unit test.
 */
export function createTestServer(): Server {
  // Delete the internal cache Node.js creates for modules to create unique instances of the server for each test.
  delete require.cache[require.resolve('../server')];
  // eslint-disable-next-line global-require
  return require('../server').createServer();
}

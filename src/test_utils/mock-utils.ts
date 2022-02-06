import { Server } from 'http';
// eslint-disable-next-line import/no-extraneous-dependencies
import request, { Request, SuperAgentTest } from 'supertest';
import { LoginFormFields, RegisterFormFields } from '../utils/auth-utils';
import { AuthToken, JWT_DETAILS, TokenData } from '../utils/token-utils';
import { models } from '../../models';
import ProvidesCallback = jest.ProvidesCallback;

export const TEST_SERVER_PORT = 5001;

// A public token from https://jwt.io/ for testing purposes.
export const MOCK_JWT =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c';

// A mock hash value for testing purposes.
export const MOCK_HASH = 'MOCK_HASH';

// A mock user data for testing purposes.
export const MOCK_USER = {
  id: '638bfaf1-3495-4066-bfea-480a14776a49',
  name: 'Test User',
  email: 'test@test.test',
  createdAt: '2021-08-22 14:50:24.922-04',
  updatedAt: '2020-02-04T08:46:36',
  password: '$2a$10$vcGuXh.vkllAmGhYY9Oe2uHKZzwToYySY9rFL7jBKcFgkFmZfA/N',
};

// A mock token data object for testing purposes.
export const MOCK_TOKEN_DATA: TokenData = {
  userID: MOCK_USER.id,
  userName: MOCK_USER.name,
};

// An auth token for mocking decrypted jwt data.
export const MOCK_AUTH_TOKEN: AuthToken = {
  iss: JWT_DETAILS.key,
  data: MOCK_TOKEN_DATA,
  iat: 1630709759,
  exp: 1630709939,
};

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
function createTestServer(): Server {
  // Delete the internal cache Node.js creates for modules to create unique instances of the server for each test.
  delete require.cache[require.resolve('../server')];
  // eslint-disable-next-line global-require
  return require('../server').createServer();
}

/**
 * This function handles creating a mock server that will allow the test agent to make requests to it.
 *
 * @param callback A callback function that passes a mock server and agent.
 * @param callback.mockServer The server instance so that a test file can close the connection after a test.
 * @param callback.testAgent The agent that will allow a unit test to make request to the mock server.
 */
export function mockServerAndAgent(
  callback: (mockServer: Server, testAgent: SuperAgentTest) => void
): ProvidesCallback {
  return (done: jest.DoneCallback): void => {
    const server = createTestServer();
    const agent = request.agent(server);

    // Start the mock server and let jest know we're done setting up.
    server.listen(TEST_SERVER_PORT, () => {
      done();
    });

    // Fire the callback function after set up.
    callback(server, agent);
  };
}

/**
 * Mocks a register request with a mock register form.
 */
export async function registerUserWithMockForm(
  testAgent: SuperAgentTest
): Promise<Request> {
  return testAgent
    .post('/api/auth/register')
    .send(MOCK_REGISTER_FORM)
    .set('Content-Type', 'application/json');
}

/**
 * Removes the mock registered user if they exist.
 */
export async function removeMockRegisteredUser(): Promise<void> {
  const user = await models.User.findOne({
    where: { email: MOCK_REGISTER_FORM.email },
  });

  if (user) {
    // Destroy the newly created user if they exist.
    await user.destroy();
  }
}

import request, { SuperAgentTest } from 'supertest';
import { Server } from 'http';
import { models } from '../../models';
import {
  MOCK_HASH,
  MOCK_JWT,
  MOCK_LOGIN_FORM,
  MOCK_REGISTER_FORM,
  TEST_SERVER_PORT,
  createTestServer,
} from '../../utils/test-utils';
import { LoginFormFields } from '../../utils/auth-utils';

// Determines if the mock bcrypt compare call should fail.
let shouldFailCompare = false;

// Mock bcrypt compare function to control behaviour of login route.
jest.mock('bcrypt', () => ({
  compare: () => !shouldFailCompare,
}));

// Mock functions that return a hash value and jwt to avoid unnecessary computations for each test.
jest.mock('../../utils/misc-utils.ts', () => {
  return {
    hashValue: async () => MOCK_HASH,
    generateToken: async () => MOCK_JWT,
  };
});

/**
 * Mocks a login request with a mock login form and returning it.
 */
async function loginUserWithMockForm(agent: SuperAgentTest) {
  return agent
    .post('/api/auth/login')
    .send(MOCK_LOGIN_FORM)
    .set('Content-Type', 'application/json');
}

/**
 * Mocks a register request with a mock register form.
 */
async function registerUserWithMockForm(agent: SuperAgentTest) {
  await agent
    .post('/api/auth/register')
    .send(MOCK_REGISTER_FORM)
    .set('Content-Type', 'application/json');
}

/**
 * This function expects a login request to fail based on the provided form values.
 */
// eslint-disable-next-line @typescript-eslint/ban-types
async function expectLoginErrorMessage(server: Server, form: LoginFormFields) {
  const response = await request(server)
    .post('/api/auth/login')
    .send(form)
    .set('Content-Type', 'application/json');

  expect(response.status).toBe(400);
  expect(response.ok).toBeFalsy();
  expect(response.body).toMatchSnapshot();
}

describe('Auth login endpoint', () => {
  let server: Server;
  let agent: SuperAgentTest;

  beforeEach(done => {
    server = createTestServer();
    server.listen(TEST_SERVER_PORT, () => {
      agent = request.agent(server);
      done();
    });

    // Reset flag.
    shouldFailCompare = false;
  });

  afterEach(async cb => {
    const user = await models.User.findOne({
      where: { email: MOCK_REGISTER_FORM.email },
    });

    if (user) {
      // Destroy the newly created user if they exist.
      await user.destroy();
    }

    server.close(cb);
  });

  it('returns error message for email that is not registered', async () => {
    await expectLoginErrorMessage(server, MOCK_LOGIN_FORM);
  });

  it('returns error message for invalid credentials', async () => {
    // Mock bcrypt compare call returning false because the provided password did not match the stored hash value.
    shouldFailCompare = true;
    // Register a new user.
    await registerUserWithMockForm(agent);

    await expectLoginErrorMessage(server, MOCK_LOGIN_FORM);
  });

  it('generates a token upon a successful login', async () => {
    await registerUserWithMockForm(agent);

    const response = await loginUserWithMockForm(agent);
    // Expect the request to succeed because the user has been registered.
    expect(response.status).toBe(200);
    expect(response.ok).toBeTruthy();
    expect(response.body.token).toEqual(MOCK_JWT);
  });
});

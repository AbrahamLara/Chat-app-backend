import request, { SuperAgentTest } from 'supertest';
import { Server } from 'http';
import {
  MOCK_JWT,
  MOCK_LOGIN_FORM,
  mockServerAndAgent,
  registerUserWithMockForm,
  removeMockRegisteredUser,
} from '../../test_utils/mock-utils';
import { LoginFormFields } from '../../utils/auth-utils';
import { mockMiscUtils } from '../../test_utils/file_mocks/mock-misc-utils';
import { mockTokenUtils } from '../../test_utils/file_mocks/mock-token-utils';

let shouldFailCompare = false; // Determines if the mock bcryptjs compare call should fail.
let server: Server;
let agent: SuperAgentTest;

// Mock bcryptjs compare function to control behaviour of login route.
jest.mock('bcryptjs', () => ({
  compare: () => !shouldFailCompare,
}));

mockMiscUtils();
mockTokenUtils();

describe('Auth login endpoint', () => {
  beforeEach(
    mockServerAndAgent((mockServer, testAgent) => {
      server = mockServer;
      agent = testAgent;

      // Reset flag.
      shouldFailCompare = false;
    })
  );

  afterEach(async cb => {
    await removeMockRegisteredUser();

    server.close(cb);
  });

  it('returns error message for email that is not registered', async () => {
    await expectLoginErrorMessage(server, MOCK_LOGIN_FORM);
  });

  it('returns error message for invalid credentials', async () => {
    // Mock bcryptjs compare call returning false because the provided password did not match the stored hash value.
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

/**
 * Mocks a login request with a mock login form and returning it.
 */
async function loginUserWithMockForm(
  testAgent: SuperAgentTest
): Promise<request.Test> {
  return testAgent
    .post('/api/auth/login')
    .send(MOCK_LOGIN_FORM)
    .set('Content-Type', 'application/json');
}

/**
 * This function expects a login request to fail based on the provided form values.
 */
async function expectLoginErrorMessage(
  testServer: Server,
  form: LoginFormFields
) {
  const response = await request(testServer)
    .post('/api/auth/login')
    .send(form)
    .set('Content-Type', 'application/json');

  expect(response.status).toBe(400);
  expect(response.ok).toBeFalsy();
  expect(response.body).toMatchSnapshot();
}

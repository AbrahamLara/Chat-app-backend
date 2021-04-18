import { Server } from 'http';
import request, { SuperAgentTest } from 'supertest';
import { models } from '../../models';
import { RegisterFormFields } from '../../utils/api/auth';
import {
  MOCK_HASH,
  MOCK_REGISTER_FORM,
  TEST_SERVER_PORT,
} from '../../utils/tests/constants';
import { createTestServer } from '../../utils/tests/helpers';

// Determines if the call that hashes the user's password should fail.
let returnHashError = false;

jest.mock('../../utils/misc.ts', () => ({
  hashValue: async () => {
    if (returnHashError) {
      throw Error('error hashing value');
    }
    return MOCK_HASH;
  },
}));

/**
 * Mocks a register request with a mock register form.
 */
async function registerUserWithMockForm(agent: SuperAgentTest) {
  return agent
    .post('/api/auth/register')
    .send(MOCK_REGISTER_FORM)
    .set('Content-Type', 'application/json');
}

/**
 * This function expects a register request to fail based on the provided form values.
 */
// eslint-disable-next-line @typescript-eslint/ban-types
async function expectRegisterErrorMessage(
  agent: SuperAgentTest,
  form: RegisterFormFields,
  status: number
) {
  const response = await agent
    .post('/api/auth/register')
    .send(form)
    .set('Content-Type', 'application/json');

  expect(response.status).toBe(status);
  expect(response.ok).toBeFalsy();
  expect(response.body).toMatchSnapshot();
}

describe('Auth register endpoint', () => {
  let server: Server;
  let agent: SuperAgentTest;

  beforeEach(done => {
    server = createTestServer();
    server.listen(TEST_SERVER_PORT, () => {
      agent = request.agent(server);
      done();
    });

    // Reset flag.
    returnHashError = false;
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

  it('returns error after failing to hash password', async () => {
    returnHashError = true;

    await expectRegisterErrorMessage(agent, MOCK_REGISTER_FORM, 500);
  });

  it('only registers an email that was previously unregistered', async () => {
    const response1 = await registerUserWithMockForm(agent);
    // Expect the request to succeed because the user's email was previously unregistered.
    expect(response1.status).toBe(200);
    expect(response1.ok).toBeTruthy();
    expect(response1.body).toMatchSnapshot();

    // Expect the request to fail because the user's email is already registered.
    await expectRegisterErrorMessage(agent, MOCK_REGISTER_FORM, 400);
  });
});

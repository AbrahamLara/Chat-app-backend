import { Server } from 'http';
import { SuperAgentTest } from 'supertest';
import { RegisterFormFields } from '../../utils/auth-utils';
import {
  MOCK_HASH,
  MOCK_REGISTER_FORM,
  mockServerAndAgent,
  registerUserWithMockForm,
  removeMockRegisteredUser,
} from '../../test_utils/mock-utils';
import { mockMiscUtils } from '../../test_utils/file_mocks/mock-misc-utils';

// Determines if the call that hashes the user's password should fail.
let returnHashError = false;
let server: Server;
let agent: SuperAgentTest;

mockMiscUtils({
  hashValue: async () => {
    if (returnHashError) {
      throw Error('error hashing value');
    }
    return MOCK_HASH;
  },
});

describe('Auth register endpoint', () => {
  beforeEach(
    mockServerAndAgent((mockServer, testAgent) => {
      server = mockServer;
      agent = testAgent;

      // Reset flag.
      returnHashError = false;
    })
  );

  afterEach(async cb => {
    await removeMockRegisteredUser();

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

/**
 * This function expects a register request to fail based on the provided form values.
 */
// eslint-disable-next-line @typescript-eslint/ban-types
async function expectRegisterErrorMessage(
  testAgent: SuperAgentTest,
  form: RegisterFormFields,
  status: number
) {
  const response = await testAgent
    .post('/api/auth/register')
    .send(form)
    .set('Content-Type', 'application/json');

  expect(response.status).toBe(status);
  expect(response.ok).toBeFalsy();
  expect(response.body).toMatchSnapshot();
}

import { Server } from 'http';
import { SuperAgentTest } from 'supertest';
import {
  MOCK_JWT,
  MOCK_USER,
  mockServerAndAgent,
} from '../../test_utils/mock-utils';
import mockUsers from '../../test_utils/sample_data/mock-users.json';
import { models } from '../../../models';
import { mockTokenUtils } from '../../test_utils/file_mocks/mock-token-utils';

const { User } = models;
const MOCK_SEARCH_USER_IDS = mockUsers.map(user => user.id);
let server: Server;
let agent: SuperAgentTest;

mockTokenUtils();

describe('Search user endpoint', () => {
  beforeEach(
    mockServerAndAgent((mockServer, testAgent) => {
      server = mockServer;
      agent = testAgent;
    })
  );

  afterEach(cb => {
    server.close(cb);
  });

  it('does not perform search without auth token', async () => {
    const response = await searchUserWithName(agent, 'e', '');
    // Expect the call to have failed because no token was provided.
    expect(response.status).toBe(401);
    expect(response.ok).toBeFalsy();
    expect(response.body).toMatchSnapshot();
  });

  it('does not return the name of the user who performed the search', async () => {
    // If an error occurs in the middle of the test, we should remove users that were already created  before attempting
    // to bulk create again.
    await removeMockUsers();
    await User.bulkCreate(mockUsers);

    const response = await searchUserWithName(agent, 'e', MOCK_JWT);

    // Expect the call to be successful and contain 10 user results and none of them being the mock user.
    expect(response.status).toBe(200);
    expect(response.ok).toBeTruthy();
    expect(response.body.results.length).toBe(10);
    expect(response.body.results).not.toContain({ name: MOCK_USER.name });

    await removeMockUsers();
  });
});

/**
 * Performs a user search from the search endpoint using the provided auth token.
 */
async function searchUserWithName(
  testAgent: SuperAgentTest,
  name: string,
  token: string
) {
  const authorizationValue = token ? `Bearer ${token}` : '';
  return testAgent
    .get(`/api/search/user?name=${name}`)
    .set('Authorization', authorizationValue);
}

/**
 * Remove every mock user that was inserted into the test database for search purposes.
 */
async function removeMockUsers() {
  await User.destroy({ where: { id: MOCK_SEARCH_USER_IDS } });
}

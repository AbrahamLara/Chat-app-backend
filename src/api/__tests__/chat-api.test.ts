import { SuperAgentTest } from 'supertest';
import { Server } from 'http';
import { MOCK_JWT, mockServerAndAgent } from '../../test_utils/mock-utils';
import { mockTokenUtils } from '../../test_utils/file_mocks/mock-token-utils';

let server: Server;
let agent: SuperAgentTest;

mockTokenUtils();

describe('Chat endpoint', () => {
  beforeEach(
    mockServerAndAgent((mockServer, testAgent) => {
      server = mockServer;
      agent = testAgent;
    })
  );

  afterEach(async cb => {
    server.close(cb);
  });

  it('returns error message if payload values are invalid', async () => {
    const response1 = await createChatResponse({ userIDs: [] });

    // Check error for blank userIDs value.
    expect(response1.ok).toEqual(false);
    expect(response1.status).toEqual(400);
    expect(response1.body).toMatchSnapshot();

    const response2 = await createChatResponse({
      userIDs: ['id-1'],
      chatName: '',
    });

    // Check error for blank chat name value.
    expect(response2.ok).toEqual(false);
    expect(response2.status).toEqual(400);
    expect(response2.body).toMatchSnapshot();

    const response3 = await createChatResponse({
      userIDs: ['id'],
      chatName: 'test',
      message: '',
    });

    // Check error for blank message value.
    expect(response3.ok).toEqual(false);
    expect(response3.status).toEqual(400);
    expect(response3.body).toMatchSnapshot();
  });
});

function createChatResponse(payload: Record<string, any>) {
  return agent
    .post(`/api/chat`)
    .send(payload)
    .set('Content-Type', 'application/json')
    .set('Authorization', `Bearer ${MOCK_JWT}`);
}

import { SuperAgentTest } from 'supertest';
import { Server } from 'http';
import { MOCK_JWT, mockServerAndAgent } from '../../test_utils/mock-utils';
import { mockTokenUtils } from '../../test_utils/file_mocks/mock-token-utils';

let server: Server;
let agent: SuperAgentTest;

const MOCK_CHAT_ID = 'CHAT_ID';

mockTokenUtils();

describe('Message endpoint', () => {
  beforeEach(
    mockServerAndAgent((mockServer, testAgent) => {
      server = mockServer;
      agent = testAgent;
    })
  );

  afterEach(async cb => {
    server.close(cb);
  });

  it('returns an error message if creating message with blank message', async () => {
    const response = await agent
      .post(`/api/message/${MOCK_CHAT_ID}`)
      .send({ message: '' })
      .set('Content-Type', 'application/json')
      .set('Authorization', `Bearer ${MOCK_JWT}`);

    expect(response.ok).toEqual(false);
    expect(response.status).toEqual(400);
    expect(response.body).toMatchSnapshot();
  });
});

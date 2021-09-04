import { MOCK_AUTH_TOKEN, MOCK_JWT } from '../mock-utils';
import { mockLocalFile } from './mock-local-file';
import { AuthToken } from '../../utils/token-utils';

const TOKEN_UTILS_FACTORY = {
  generateToken: async () => MOCK_JWT,
  verifyToken: async (): Promise<AuthToken> => MOCK_AUTH_TOKEN,
};

type TokenUtilsFactory = typeof TOKEN_UTILS_FACTORY;

/**
 * Mocks functions that exist in token-utils.ts. This allows us to generate and verify tokens that contain mock user
 * data without having to make calls to the login endpoint.
 */
export function mockTokenUtils(factory: Partial<TokenUtilsFactory> = {}): void {
  mockLocalFile<TokenUtilsFactory>(
    '../../utils/token-utils',
    TOKEN_UTILS_FACTORY,
    factory
  );
}

import { MOCK_HASH } from '../utils/test-utils';

interface MockBcrypt {
  hash: () => string;

  compare: () => boolean;
}

const bcrypt = jest.createMockFromModule<MockBcrypt>('bcrypt');

bcrypt.hash = () => {
  return MOCK_HASH;
};

bcrypt.compare = () => {
  return true;
};

export default bcrypt;

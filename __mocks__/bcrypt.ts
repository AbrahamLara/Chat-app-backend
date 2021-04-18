import { MOCK_HASH } from '../utils/tests/constants';

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

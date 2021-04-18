import { LoginFormFields, RegisterFormFields } from '../api/auth';

const TEST_SERVER_PORT = 5001;

// A public token from https://jwt.io/ for testing purposes.
const MOCK_JWT =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c';

const MOCK_HASH = 'MOCK_HASH';

const MOCK_LOGIN_FORM: LoginFormFields = {
  email: 'test1@test.test',
  password: 'Testing1!',
};

const MOCK_REGISTER_FORM: RegisterFormFields = {
  ...MOCK_LOGIN_FORM,
  name: 'Test User',
  confPassword: MOCK_LOGIN_FORM.password,
};

export {
  TEST_SERVER_PORT,
  MOCK_JWT,
  MOCK_HASH,
  MOCK_LOGIN_FORM,
  MOCK_REGISTER_FORM,
};

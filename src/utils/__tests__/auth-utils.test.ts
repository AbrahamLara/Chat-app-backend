import {
  MOCK_LOGIN_FORM,
  MOCK_REGISTER_FORM,
} from '../../test_utils/mock-utils';
import { getLoginFormErrors, getRegisterFormErrors } from '../response-utils';

describe('auth api utils', () => {
  it('getRegisterFormErrors returns error messages based on invalid form value', () => {
    expect(
      getRegisterFormErrors({
        ...MOCK_REGISTER_FORM,
        name: '',
      })
    ).toMatchSnapshot();

    expect(
      getRegisterFormErrors({
        ...MOCK_REGISTER_FORM,
        email: '',
      })
    ).toMatchSnapshot();

    expect(
      getRegisterFormErrors({
        ...MOCK_REGISTER_FORM,
        password: '',
      })
    ).toMatchSnapshot();

    expect(
      getRegisterFormErrors({
        ...MOCK_REGISTER_FORM,
        confPassword: '',
      })
    ).toMatchSnapshot();

    expect(
      getRegisterFormErrors({
        ...MOCK_REGISTER_FORM,
        password: 'test',
        confPassword: 'testing',
      })
    ).toMatchSnapshot();

    expect(
      getRegisterFormErrors({
        name: '',
        email: '',
        password: '',
        confPassword: '',
      })
    ).toMatchSnapshot();
  });

  it('getLoginFormErrors returns error messages based on invalid form value', () => {
    expect(
      getLoginFormErrors({
        ...MOCK_LOGIN_FORM,
        email: '',
      })
    ).toMatchSnapshot();

    expect(
      getLoginFormErrors({
        ...MOCK_LOGIN_FORM,
        password: '',
      })
    ).toMatchSnapshot();

    expect(
      getLoginFormErrors({
        email: '',
        password: '',
      })
    ).toMatchSnapshot();
  });
});

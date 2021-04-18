import {
  ErrorPayload,
  ErrorPayloadType,
  FormErrorMessage,
} from '../error-types';
import {
  AuthFormField,
  LoginResponseMessage,
  RegisterResponseMessage,
} from '../constants';

// The login form fields provided by client-side.
interface LoginFormFields {
  email: string;
  password: string;
}

// The register form fields provided by client-side.
interface RegisterFormFields extends LoginFormFields {
  name: string;
  // The confirmation password that should match the value of the password field.
  confPassword: string;
}

/**
 * Regex for validating user passwords.
 *
 * Rules:
 *
 * ^                  - Start of the string.
 *
 * (?=.*[a-z])        - Contains at least one lowercase character.
 *
 * (?=.*[A-Z])        - Contains at least one uppercase character.
 *
 * (?=.*[0-9])        - Contains at least one number.
 *
 * (?=.*[!@#$%^&*\-_]) - Contains at least one special character: !, @, #, $, %, ^, &, *, -, _.
 *
 * .{8,}              - Is minimum 8 characters in length.
 *
 * $                  - End of the string.
 */
const PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*\-_]).{8,}$/;

/**
 * Regex for validating user emails.
 *
 * See the longer RFC 5322 Official Standard email regex: https://emailregex.com/
 */
const EMAIL_REGEX = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

/**
 * Returns an array of errors from the provided register fields.
 *
 * @param fields Register form fields
 */
function getRegisterFormErrors(
  fields: RegisterFormFields
): FormErrorMessage[] | null {
  const { name, email, password, confPassword } = fields;
  const errors: FormErrorMessage[] = [];
  // Check that all the fields are filled.
  if (!name && !email && !password && !confPassword) {
    errors.push({ message: RegisterResponseMessage.FIELDS_ARE_BLANK });
  }

  // If no name is provided in the form, return error message to remind the user.
  if (!name) {
    errors.push({
      message: RegisterResponseMessage.BLANK_NAME,
      field: AuthFormField.NAME,
    });
  }

  // Determine if provided email is valid even if validation is done client-side.
  if (!RegExp(EMAIL_REGEX).test(email)) {
    errors.push({
      message: RegisterResponseMessage.INVALID_EMAIL,
      field: AuthFormField.EMAIL,
    });
  }

  // Determine if provided password is valid even if validation is done client-side.
  if (!RegExp(PASSWORD_REGEX).test(password)) {
    errors.push({
      message: RegisterResponseMessage.INVALID_PASSWORD,
      field: AuthFormField.PASSWORD,
    });
  }

  // The confirmation password must equal the original password.
  if (password !== confPassword) {
    errors.push({
      message: RegisterResponseMessage.INVALID_CONFIRMATION_PASSWORD,
      field: AuthFormField.CONF_PASSWORD,
    });
  }

  return errors.length ? errors : null;
}

/**
 * Returns an array of errors from the provided login fields.
 *
 * @param fields Login form fields
 */
function getLoginFormErrors(
  fields: LoginFormFields
): FormErrorMessage[] | null {
  const { email, password } = fields;
  const errors: FormErrorMessage[] = [];
  // Check that email and password are filled.
  if (!email && !password) {
    errors.push({ message: LoginResponseMessage.FIELDS_ARE_BLANK });
  }

  if (!email) {
    errors.push({
      message: LoginResponseMessage.BLANK_EMAIL,
      field: AuthFormField.EMAIL,
    });
  }

  if (!password) {
    errors.push({
      message: LoginResponseMessage.BLANK_PASSWORD,
      field: AuthFormField.PASSWORD,
    });
  }

  return errors.length ? errors : null;
}

// Creates a register form error response.
function getRegisterErrorMessages(errors: FormErrorMessage[]): ErrorPayload {
  return { type: ErrorPayloadType.REGISTER, errors };
}

// Creates a login form error response.
function getLoginErrorMessages(errors: FormErrorMessage[]): ErrorPayload {
  return { type: ErrorPayloadType.LOGIN, errors };
}

export {
  LoginFormFields,
  RegisterFormFields,
  getRegisterErrorMessages,
  getLoginErrorMessages,
  getRegisterFormErrors,
  getLoginFormErrors,
};

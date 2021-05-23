import {
  AuthFormField,
  EMAIL_REGEX,
  LoginFormFields,
  LoginResponseMessage,
  PASSWORD_REGEX,
  RegisterFormFields,
  RegisterResponseMessage,
} from './auth-utils';

export enum ApiRoute {
  REGISTER = 'register',
  LOGIN = 'login',
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
interface GenericMessage {
  /**
   * Generic message to send as response.
   */
  message: string;
}

/**
 * Describes an error message for an invalid form field value.
 */
export interface FormErrorMessage extends GenericMessage {
  /**
   * The form field the error message is for. This doesn't need to be provided if a form error wasn't due to an invalid
   * field value.
   */
  field?: string;
}

/**
 * Describes the payload to return for a failed request.
 */
export interface ErrorPayload {
  /**
   * The error message type represented as the api route sending the error payload.
   *
   * Note: This might not actually be needed.
   */
  type: ApiRoute;

  /**
   * The error messages produced. Right now the backend only serves form errors.
   */
  errors: FormErrorMessage[];
}

/**
 * Creates a generic message object.
 */
export function createGenericMessage(message: string): GenericMessage {
  return { message };
}

/**
 * Returns an array of errors from the provided register fields.
 *
 * @param fields Register form fields
 */
export function getRegisterFormErrors(
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
  if (!confPassword) {
    errors.push({
      message: RegisterResponseMessage.BLANK_CONF_PASSWORD,
      field: AuthFormField.CONF_PASSWORD,
    });
  } else if (password !== confPassword) {
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
export function getLoginFormErrors(
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

/**
 * Creates a register form error response.
 */
export function getRegisterErrorMessages(
  errors: FormErrorMessage[]
): ErrorPayload {
  return { type: ApiRoute.REGISTER, errors };
}

/**
 * Creates a login form error response.
 */
export function getLoginErrorMessages(
  errors: FormErrorMessage[]
): ErrorPayload {
  return { type: ApiRoute.LOGIN, errors };
}

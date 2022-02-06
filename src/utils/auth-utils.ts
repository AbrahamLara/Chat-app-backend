/**
 * Register form message responses for the register api route.
 */
export enum RegisterAPIMessage {
  FIELDS_ARE_BLANK = 'All fields must be filled in.',
  BLANK_NAME = 'Please enter your name.',
  BLANK_CONF_PASSWORD = 'Please re-enter your password to confirm.',
  INVALID_EMAIL = 'You must enter a valid email.',
  INVALID_PASSWORD = 'You must enter a valid password.',
  INVALID_CONFIRMATION_PASSWORD = 'Your confirmation password must match your password.',
  EMAIL_IN_USE = 'The email provided is already in use.',
  REGISTER_FAILED = 'There was an error registering.',
  REGISTER_SUCCEEDED = 'You have successfully registered to ChatApp!',
}

/**
 * Login form message responses for the login api route.
 */
export enum LoginAPIMessage {
  FIELDS_ARE_BLANK = 'Please fill in both fields.',
  BLANK_EMAIL = 'Enter your email to login',
  BLANK_PASSWORD = 'Enter your password to login',
  INVALID_EMAIL = 'There is no user with this email.',
  INVALID_CREDENTIALS = 'Invalid credentials',
  LOGIN_FAILED = 'An error occurred trying to login.',
}

/**
 * Authorization message if a user is not allowed access to something.
 */
export enum AuthorizationMessage {
  UNAUTHORIZED = 'You are not authorized to perform this action',
  INVALID_TOKEN = 'The provided token is invalid',
}

/**
 * The auth form field names for registering/logging in.
 */
export enum AuthFormField {
  NAME = 'name',
  EMAIL = 'email',
  PASSWORD = 'password',
  CONF_PASSWORD = 'confPassword',
}

/**
 * The login form fields provided by client-side.
 */
export interface LoginFormFields {
  email: string;
  password: string;
}

/**
 * The register form fields provided by client-side.
 */
export interface RegisterFormFields extends LoginFormFields {
  /**
   * The name of the user registering an account.
   */
  name: string;

  /**
   * The confirmation password that should match the value of the password field
   */
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
export const PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*\-_]).{8,}$/;

/**
 * Regex for validating user emails.
 *
 * See the longer RFC 5322 Official Standard email regex: https://emailregex.com/
 */
export const EMAIL_REGEX = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

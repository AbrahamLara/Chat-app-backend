// TODO: Rename this file to reflect the contents.
/**
 * Register form message responses for the register api route.
 */
enum RegisterResponseMessage {
  FIELDS_ARE_BLANK = 'All fields must be filled in.',
  BLANK_NAME = 'Please enter your name.',
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
enum LoginResponseMessage {
  FIELDS_ARE_BLANK = 'Please fill in both fields.',
  BLANK_EMAIL = 'Enter your email to login',
  BLANK_PASSWORD = 'Enter your password to login',
  INVALID_EMAIL = 'There is no user with this email.',
  INVALID_CREDENTIALS = 'Invalid credentials',
  LOGIN_FAILED = 'An error occurred trying to login.',
}

enum AuthFormField {
  NAME = 'name',
  EMAIL = 'email',
  PASSWORD = 'password',
  CONF_PASSWORD = 'confPassword',
}

export { RegisterResponseMessage, LoginResponseMessage, AuthFormField };

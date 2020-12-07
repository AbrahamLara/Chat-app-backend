import {
  EMAIL_REGEX,
  FormError,
  FormErrorResponse,
  PASSWORD_REGEX,
} from '../misc';

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
 * Returns an array of errors from the provided register fields.
 *
 * @param fields Register form fields
 */
function getRegisterFormErrors(fields: RegisterFormFields): FormError[] | null {
  const { name, email, password, confPassword } = fields;
  const errors: FormError[] = [];
  // Check that all the fields are filled.
  if (!name || !email || !password || !confPassword) {
    errors.push({ message: 'All fields must be filled in.' });
  }
  // Determine if provided email is valid even if validation is done client-side.
  if (!RegExp(EMAIL_REGEX).test(email)) {
    errors.push({ message: 'You must enter a valid email.', field: 'email' });
  }
  // Determine if provided password is valid even if validation is done client-side.
  if (!RegExp(PASSWORD_REGEX).test(password)) {
    errors.push({
      message: 'You must enter a valid password.',
      field: 'password',
    });
  }
  // The confirmation password must equal the original password.
  if (password !== confPassword) {
    errors.push({
      message: 'Your confirmation password must match your password.',
      field: 'confPassword',
    });
  }
  return errors.length ? errors : null;
}

/**
 * Returns an array of errors from the provided login fields.
 *
 * @param fields Login form fields
 */
function getLoginFormErrors(fields: LoginFormFields): FormError[] | null {
  const { email, password } = fields;
  const errors: FormError[] = [];
  // Check that email and password are filled.
  if (!email && !password) {
    errors.push({ message: 'Please fill in both fields.' });
  }
  if (!email) {
    errors.push({ message: 'Enter an email to login', field: 'email' });
  }
  if (!password) {
    errors.push({
      message: 'Enter a password to login.',
      field: 'password',
    });
  }
  return errors.length ? errors : null;
}

// Creates a register form error response.
function registerErrorResponse(errors: FormError[]): FormErrorResponse {
  return { type: 'register', errors };
}

// Creates a login form error response.
function loginErrorResponse(errors: FormError[]): FormErrorResponse {
  return { type: 'login', errors };
}

export {
  registerErrorResponse,
  loginErrorResponse,
  RegisterFormFields,
  getRegisterFormErrors,
  getLoginFormErrors,
};

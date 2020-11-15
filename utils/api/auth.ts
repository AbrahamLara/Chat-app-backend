import {
  EMAIL_REGEX,
  FormError,
  FormErrorResponse,
  PASSWORD_REGEX,
} from '../misc';

// The form fields expected to be received from a request body when a user is registering on the client-side of the app.
interface RegisterFormFields {
  firstName: string;
  lastName: string;
  email: string;
  password: string;

  // The confirmation password that should match the value of the password field.
  confPassword: string;
}

/**
 * Returns an array of form errors pertaining to the register form if there are any.
 *
 * @param fields - Register form fields
 */
function getRegisterFormErrors(fields: RegisterFormFields): FormError[] | null {
  const { firstName, lastName, email, password, confPassword } = fields;
  const errors: FormError[] = [];
  // Check that all the fields are filled before we proceed.
  if (!firstName || !lastName || !email || !password || !confPassword) {
    errors.push({ message: 'All fields must be filled in.' });
  }
  // Determine if provided email is valid even if validation is done client-side.
  if (!RegExp(EMAIL_REGEX).test(email)) {
    errors.push({ message: 'You must enter a valid email.', field: 'email' });
  }
  // Determine if provided password is valid even it validation is done client-side.
  if (!RegExp(PASSWORD_REGEX).test(password)) {
    errors.push({
      message: 'You must enter a valid password.',
      field: 'password',
    });
  }
  // The confirmation password must equal the original password.
  console.log('password', password, confPassword);
  if (password !== confPassword) {
    errors.push({
      message: 'Your confirmation password must match your password.',
      field: 'confPassword',
    });
  }
  return errors.length ? errors : null;
}

// Creates a register form error response.
function registerErrorResponse(errors: FormError[]): FormErrorResponse {
  return { type: 'register', errors };
}

export { registerErrorResponse, RegisterFormFields, getRegisterFormErrors };

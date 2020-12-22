import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

// This describes an error that has occurred when filling out a form.
interface FormError {
  // The error message to display on the for a form field.
  message: string;

  // The form field the error message is for.
  field?: string;
}

// The error response returned when incorrectly filling forms.
interface FormErrorResponse {
  // The type of form that will be filled.
  type: string;

  // The errors that have occurred for each field.
  errors: FormError[];
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

// The jwt secret key for generating tokens.
const JWT_SECRET_KEY = 'CHAT_APP_SECRET';

/**
 * Hashes the given value and returns an array that includes the result if successful and an error message otherwise.
 *
 * @param value The value to hash.
 * @param salt The salt used in the encryption.
 * @return Promise of [error, hash]
 */
async function hashValue(
  value: string,
  salt: string | number
): Promise<[string, string]> {
  let hash = '';
  let error = '';
  // Attempt to hash the given value.
  try {
    hash = await bcrypt.hash(value, salt);
  } catch (e) {
    error = 'There was an error hashing the given value.';
  }
  return [error, hash];
}

/**
 * Generates a jwt token encoded with the given payload. The token only lasts for an hour.
 *
 * @param payload Data to encode in the token.
 */
async function generateToken(
  payload: string | Buffer | Record<string, unknown>
): Promise<string> {
  return jwt.sign(payload, JWT_SECRET_KEY, { expiresIn: 3600 });
}

export {
  FormError,
  FormErrorResponse,
  PASSWORD_REGEX,
  EMAIL_REGEX,
  hashValue,
  JWT_SECRET_KEY,
  generateToken,
};

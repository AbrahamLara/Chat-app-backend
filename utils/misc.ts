import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

// The jwt secret key for generating tokens.
const JWT_SECRET_KEY = 'CHAT_APP_SECRET';

/**
 * Hashes the given value and returns the hashed result.
 *
 * @param value The value to hash.
 * @param salt The salt used in the encryption.
 * @return Promise of hash
 */
async function hashValue(
  value: string,
  salt: string | number
): Promise<string> {
  let hash = '';
  // Attempt to hash the given value.
  try {
    hash = await bcrypt.hash(value, salt);
  } catch (event) {
    // Throw error message if hashing user's password failed.
    throw Error('There was an error hashing the given value.');
  }
  return hash;
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

export { hashValue, JWT_SECRET_KEY, generateToken };

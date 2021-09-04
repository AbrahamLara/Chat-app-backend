import bcrypt from 'bcryptjs';

/**
 * Hashes the given value and returns the hashed result.
 *
 * @param value The value to hash.
 * @param salt The salt used in the encryption.
 * @return Promise of hash
 */
export async function hashValue(
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

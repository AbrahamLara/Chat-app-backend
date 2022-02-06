import jws from 'jws';
import { generateJWT, readJWT } from 'jwt-token-encrypt';

// The encryption settings for encrypting data to insert in a JWT payload.
const JWT_ENCRYPTION = {
  key: 'JWT_ENCRYPTION_KEY',
  algorithm: 'aes-256-cbc',
};
// The details for generating a JWT.
export const JWT_DETAILS = {
  secret: 'JWT_SECRET_KEY',
  expiresIn: '3m',
  key: 'ChatAppISS',
};

/**
 * Token data that can be used to perform authorized actions.
 */
export interface TokenData {
  /**
   * The authenticated user's id.
   */
  userID: string;

  /**
   * The name of the authenticated user.
   */
  userName: string;
}

/**
 * Describes an auth token that gives user's permission to perform certain actions.
 */
export interface AuthToken {
  /**
   * The issuer who created the token.
   */
  iss: string;

  /**
   * The token payload with private user data.
   */
  data: TokenData;

  /**
   * The time the token was created, as a unix timestamp offset in seconds.
   */
  iat: number;

  /**
   * The time the token is set to expire, as a unix timestamp offset in seconds.
   */
  exp: number;
}

/**
 * Generates a jwt token encoded with the given payload. The token only lasts for an hour.
 *
 * @param payload Data to encode in the token.
 */
export async function generateToken(
  payload: string | Buffer | Record<string, unknown>
): Promise<string> {
  return generateJWT(JWT_DETAILS, { role: 'user' }, JWT_ENCRYPTION, payload);
}

/**
 * Returns the decrypted token data after validating the token.
 *
 * Note: Because the "readJWT" function from "jwt-token-encrypt" doesn't verify the token before decrypting the data and
 * returning it, this function handles that verification since it's not worth using the "verify" method from
 * "jsonwebtoken" since it does the same verification process without decrypting the data.
 */
export async function verifyToken(token: string): Promise<AuthToken> {
  // Verify the token signature is from us.
  const isValid = jws.verify(
    token,
    'HS256', // This is the same algorithm as aes-256-cbc which is used for generating a jwt.
    JWT_DETAILS.secret
  );

  if (!isValid) {
    throw Error('Token has invalid signature.');
  }

  // Determine if the token has expired.
  const authToken: AuthToken = await readJWT(token, JWT_ENCRYPTION);
  const clockTimestamp = Math.floor(Date.now() / 1000);
  const isExpired = clockTimestamp >= authToken.exp;

  if (isExpired) {
    throw Error('Token has expired.');
  }

  // Throw an error if the token issuer is not us.
  if (authToken.iss !== JWT_DETAILS.key) {
    throw Error('Token issuer is invalid.');
  }

  return authToken;
}

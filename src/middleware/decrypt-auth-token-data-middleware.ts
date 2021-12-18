import { NextFunction, Request, Response } from 'express';
import { createGenericMessage } from '../utils/message-utils';
import { AuthorizationMessage } from '../utils/auth-utils';
import { verifyToken } from '../utils/token-utils';

/**
 * This middleware handles verifying the auth token and adding the decrypted token data to the request for the
 * next request handler to utilize.
 */
export async function DecryptAuthTokenDataMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  // If no token has been provided, then the user is not authorized to call this endpoint.
  const token = req.headers.authorization?.replace('Bearer ', '');
  if (!token) {
    res
      .status(403)
      .json(createGenericMessage(AuthorizationMessage.UNAUTHORIZED));
    return;
  }

  try {
    // Verify the token and add the token data to the request.
    const tokenData = await verifyToken(token);
    req.tokenData = tokenData.data;
    next();
  } catch (_) {
    res
      .status(403)
      .json(createGenericMessage(AuthorizationMessage.INVALID_TOKEN));
  }
}

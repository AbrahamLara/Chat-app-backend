import * as Express from 'express';
import { TokenData } from '../../utils/token-utils';

declare module 'express' {
  interface Request extends Express.Request {
    /**
     * Token data that can be used to perform authorized actions.
     */
    tokenData?: TokenData;
  }
}

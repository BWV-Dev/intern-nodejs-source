/**
 * Custom definition for Express.Request
 */
import { IMessage } from '../../constants';
import * as models from '../../models';
import 'express-session';

declare global {
  namespace Express {
    // tslint:disable-next-line:interface-name
    interface Request {
      user: Partial<models.User> & {
        token?: {
          accessToken: string;
          refreshToken: string;
        };
        isAuthorized: boolean;
        getServiceOption?(): {
          endpoint: string;
          accessToken?: string;
          refreshToken?: string;
          storeToken?(token: {
            accessToken: string;
            refreshToken: string;
          }): void;
        };
        destroy(): void;
      };
      consumeSession<X>(): { formData?: X; message?: IMessage };
    }
  }
}

declare module 'express-session' {
  export interface SessionData {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    user: { [key: string]: any };
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    formData?: any;
    message?: IMessage;
  }
}

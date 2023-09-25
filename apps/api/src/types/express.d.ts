import { User } from '@logbook/database';

declare global {
  namespace Express {
    interface Request {
      user?: User;
    }
  }
}

export {};

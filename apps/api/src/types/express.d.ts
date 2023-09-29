import { User as UserDB } from '@logbook/database';

// set the user type on the express request object
declare global {
  namespace Express {
    interface User extends UserDB {}
  }
}

export {};

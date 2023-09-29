import { User } from '@logbook/database';

declare module 'http' {
  interface IncomingMessage {
    user?: User;
  }
}

export {};

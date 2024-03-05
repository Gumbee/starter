import { User } from '@forge/database';

declare module 'http' {
  interface IncomingMessage {
    user?: User;
  }
}

export {};

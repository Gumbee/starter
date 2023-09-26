import { Maybe } from '@logbook/types';

const withArgs = (...args: Maybe<string>[]) => (args.some((a) => !a) ? undefined : args[args.length - 1]);

/** ============= Auth ============= */

export const ROUTES = {
  getSignoutRoute: () => '/auth/signout',
  getCredentialsSigninRoute: () => `/auth/signin/credentials`,
  getCredentialsSignupRoute: () => `/auth/signup/credentials`,
  getOauthRoute: (provider: string) => `/auth/oauth/${provider}`,
};

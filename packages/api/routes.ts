import { Maybe } from '@forge/common/types';

const withArgs = (...args: Maybe<string>[]) => (args.some((a) => !a) ? undefined : args[args.length - 1]);

/** ============= Auth ============= */

export const ROUTES = {
  getSignoutRoute: () => '/auth/signout',
  getCredentialsSignInRoute: () => `/auth/signin/credentials`,
  getCredentialsSignUpRoute: () => `/auth/signup/credentials`,
  getOAuthRoute: (provider: string) => `/auth/oauth/${provider}`,
  getOAuthNativeRoute: (provider: string) => `/auth/oauth/native/${provider}`,
  getOAuthNativeRedeemRoute: (provider: string) => `/auth/oauth/native/${provider}/redeem`,
  // USER
  getUsersMe: () => `/users/me`,
};

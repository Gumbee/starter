import { Maybe, Optional } from '@forge/common/types';

const withArgs = (...args: Maybe<string>[]) => (args.some((a) => !a) ? undefined : args[args.length - 1]);
const toParams = (params: Optional<Record<string, Optional<string>>>): string => {
  if (!params) return '';

  return (
    '?' +
    Object.entries(params)
      .filter(([_, v]) => v !== undefined && v !== null)
      .map(([k, v]) => `${k}=${v}`)
      .join('&')
  );
};

/** ============= Auth ============= */

export const ROUTES = {
  getSignoutRoute: () => '/auth/signout',
  getCredentialsSignInRoute: () => `/auth/signin/credentials`,
  getCredentialsSignUpRoute: () => `/auth/signup/credentials`,
  getOAuthSigninRoute: (provider: string, data?: Record<string, Optional<string>>) =>
    withArgs(provider, `/auth/oauth/signin/${provider}${toParams(data)}`),
  getOAuthSignupRoute: (provider: string, data?: Record<string, Optional<string>>) =>
    withArgs(provider, `/auth/oauth/signup/${provider}${toParams(data)}`),
  getOAuthNativeSigninRoute: (provider: string, data?: Record<string, Optional<string>>) =>
    withArgs(provider, `/auth/oauth/native/signin/${provider}${toParams(data)}`),
  getOAuthNativeSignupRoute: (provider: string, data?: Record<string, Optional<string>>) =>
    withArgs(provider, `/auth/oauth/native/signup/${provider}${toParams(data)}`),
  getOAuthNativeRedeemRoute: (provider: string) => withArgs(provider, `/auth/oauth/native/${provider}/redeem`),
  // USER
  getUsersMe: () => `/users/me`,
};

import { AuthStore } from './store';

export type OAuthProvider = 'google';

export type OAuthHook = {
  handleOAuthSignin: (provider: OAuthProvider) => Promise<any>;
};

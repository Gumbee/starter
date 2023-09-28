export type OAuthProvider = 'google';

export type OAuthHook = {
  handleOAuthLogin: (provider: OAuthProvider) => Promise<any>;
  //wheather some blocking action is loading
  loading: boolean;
};

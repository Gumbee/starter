import { Optional } from '@forge/common/types';
import { AuthStore } from './store';
import { User } from '@forge/database';

export type OAuthProvider = 'google';

export type OAuthHook = {
  handleOAuth: (
    provider: OAuthProvider,
    method: 'signin' | 'signup',
    data?: Record<string, Optional<string>>,
  ) => Promise<Optional<User>>;
};

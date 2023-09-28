import { IS_NATIVE_APP } from '@logbook/constants';
import { useOAuthProviderSignin as useOAuthProviderSigninNative } from './oauthNative';
import { useOAuthProviderSignin as useOAuthProviderSigninWeb } from './oauthWeb';

export const useOAuthProviderSignin = IS_NATIVE_APP ? useOAuthProviderSigninNative : useOAuthProviderSigninWeb;

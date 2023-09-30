import { IS_NATIVE_APP } from '@logbook/common/environment';
import { useOAuthProviderSignin as useOAuthProviderSigninDesktop } from './oauth.desktop';
import { useOAuthProviderSignin as useOAuthProviderSigninWeb } from './oauth.web';

export const useOAuthProviderSignin = IS_NATIVE_APP ? useOAuthProviderSigninDesktop : useOAuthProviderSigninWeb;

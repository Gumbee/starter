import { IS_NATIVE_APP } from '@forge/common/environment';
import { useOAuthProvider as useOAuthProviderDesktop } from './oauth.desktop';
import { useOAuthProvider as useOAuthProviderWeb } from './oauth.web';

export const useOAuthProvider = IS_NATIVE_APP ? useOAuthProviderDesktop : useOAuthProviderWeb;

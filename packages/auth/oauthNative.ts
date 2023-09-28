import { API_BASE_URL, ROUTES, api } from '@logbook/api';
import { OAuthProvider } from './types';
import { invoke } from '@tauri-apps/api/tauri';
import { open } from '@tauri-apps/api/shell';
import { UnlistenFn, listen } from '@tauri-apps/api/event';

let unlisten: UnlistenFn | undefined = undefined;

export function useOAuthProviderSignin() {
  const handleOAuthLogin = (provider: OAuthProvider): Promise<any> => {
    return new Promise(async (resolve, reject) => {
      console.log('Attempting to authenticate with provider', provider);

      const [codeChallenge, codeVerifier] = await invoke<[string, string]>('generate_code_challenge');

      await open(`${API_BASE_URL}${ROUTES.getOauthNativeRoute(provider)}?code_challenge=${codeChallenge}`);

      if (unlisten) unlisten();

      listen<string>('scheme-request-received', async (event) => {
        const url = event.payload;

        if (event.payload) {
          console.log('Received valid scheme request', url);
          const query = url.split('?')[1];

          api
            .post(ROUTES.getOauthNativeRedeemRoute(provider) + `?${query}`, {
              verifier: codeVerifier,
            })
            .then((x) => {
              console.log('We gots the user', x.data);
            })
            .catch((e) => {
              console.error('Error redeeming code', e);
            });

          if (unlisten) unlisten();
        }
      }).then((fn) => {
        unlisten = fn;
      });

      resolve(undefined);
    });
  };

  return { handleOAuthLogin };
}

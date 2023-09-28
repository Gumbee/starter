import { api } from '@logbook/api/client';
import { ROUTES } from '@logbook/api/routes';
import { OAuthHook, OAuthProvider } from './types';
import { invoke } from '@tauri-apps/api/tauri';
import { open } from '@tauri-apps/api/shell';
import { UnlistenFn, listen } from '@tauri-apps/api/event';
import { useState } from 'react';
import { Optional } from '@logbook/types';
import { API_BASE_URL } from '@logbook/api/constants';

let unlisten: Optional<UnlistenFn> = undefined;

let t: Optional<ReturnType<typeof setTimeout>> = undefined;

export function useOAuthProviderSignin(): OAuthHook {
  const [loading, setLoading] = useState(false);

  const handleOAuthLogin = (provider: OAuthProvider): Promise<any> => {
    setLoading(true);

    return new Promise(async (resolve, reject) => {
      const [codeChallenge, codeVerifier] = await invoke<[string, string]>('generate_code_challenge');

      // felt weird when it opens instantly, so we wait a bit
      await new Promise((resolve) => {
        t = setTimeout(() => {
          resolve(undefined);
        }, 300);
      });

      await open(`${API_BASE_URL}${ROUTES.getOauthNativeRoute(provider)}?code_challenge=${codeChallenge}`);

      clearTimeout(t);

      // can't tell if window is closed in native app, so we assume it's not loading anymore
      t = setTimeout(() => {
        setLoading(false);
      }, 1000);

      unlisten?.();

      listen<string>('scheme-request-received', async (event) => {
        const url = event.payload;

        if (event.payload && event.payload.startsWith(`logbook://oauth/${provider}`)) {
          const query = url.split('?')[1];

          api
            .post<{ user: any }>(ROUTES.getOauthNativeRedeemRoute(provider) + `?${query}`, {
              verifier: codeVerifier,
            })
            .then((x) => {
              unlisten?.();
              resolve(x.data.user);
            })
            .catch((e) => {
              unlisten?.();
              reject(e);
            });
        }
      })
        .then((fn) => {
          unlisten = fn;
        })
        .catch((e) => {
          unlisten?.();
          reject(e);
        });

      // timeout after 5 minutes
      setTimeout(
        () => {
          unlisten?.();
          reject('Timeout');
        },
        1000 * 60 * 5,
      );
    });
  };

  return { handleOAuthLogin, loading };
}

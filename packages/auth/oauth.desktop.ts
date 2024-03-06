import { api } from '@forge/api/client';
import { ROUTES } from '@forge/api/routes';
import { OAuthHook, OAuthProvider } from './types';
import { invoke } from '@tauri-apps/api/tauri';
import { open } from '@tauri-apps/api/shell';
import { UnlistenFn, listen } from '@tauri-apps/api/event';
import { Optional } from '@forge/common/types';
import { API_BASE_URL } from '@forge/api/constants';
import { useSetLoading, useSetUser } from './store/hooks';
import { User } from '@forge/database';

let unlisten: Optional<UnlistenFn> = undefined;

let t: Optional<ReturnType<typeof setTimeout>> = undefined;

export function useOAuthProvider(): OAuthHook {
  const setUser = useSetUser();
  const setLoading = useSetLoading();

  const handleOAuth = (
    provider: OAuthProvider,
    method: 'signin' | 'signup',
    data?: Record<string, Optional<string>>,
  ): Promise<Optional<User>> => {
    setLoading(provider);

    return new Promise<Optional<User>>(async (resolve, reject) => {
      const [codeChallenge, codeVerifier] = await invoke<[string, string]>('generate_code_challenge');

      // felt weird when it opens instantly, so we wait a bit
      await new Promise((resolve) => {
        t = setTimeout(() => {
          resolve(undefined);
        }, 300);
      });

      const route =
        method === 'signin' ? ROUTES.getOAuthNativeSigninRoute(provider, data) : ROUTES.getOAuthNativeSignupRoute(provider, data);

      await open(`${API_BASE_URL}${route}?code_challenge=${codeChallenge}`);

      clearTimeout(t);

      // can't tell if window is closed in native app, so we assume it's not loading anymore
      t = setTimeout(() => {
        setLoading(undefined);
      }, 1000);

      unlisten?.();

      listen<string>('scheme-request-received', async (event) => {
        const url = event.payload;

        if (event.payload && event.payload.startsWith(`artweave://oauth/${provider}`)) {
          const query = url.split('?')[1];

          api
            .post<{ user: any }>(ROUTES.getOAuthNativeRedeemRoute(provider) + `?${query}`, {
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
    }).then((user) => {
      if (user) {
        setUser(user);
      }

      window.location.replace('/log/[id]?id=mimom');

      return user;
    });
  };

  return { handleOAuth };
}

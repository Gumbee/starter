import { API_BASE_URL } from '@forge/api/constants';
import { OAuthHook, OAuthProvider } from './types';
import { ROUTES } from '@forge/api/routes';
import { User } from '@forge/database';
import { Optional } from '@forge/common/types';
import { useSetLoading, useSetUser } from './store/hooks';

export function useOAuthProviderSignin(): OAuthHook {
  const setUser = useSetUser();
  const setLoading = useSetLoading();

  const handleOAuthSignin = (provider: OAuthProvider): Promise<any> => {
    setLoading(provider);

    return new Promise<Optional<User>>((resolve, reject) => {
      const popup = window.open(
        `${API_BASE_URL}${ROUTES.getOAuthRoute(provider)}`,
        undefined,
        `popup=yes,left=1000,top=100,width=700,height=800`,
      );

      let poll: number;

      const cleanup = () => {
        if (poll) {
          window.clearInterval(poll);
        }

        window.removeEventListener(`close`, handleClosed);
        window.removeEventListener(`unload`, handleClosed);
        window.removeEventListener(`message`, handleMessage);
      };

      const handleClosed = () => {
        cleanup();
      };

      const backend = new URL(API_BASE_URL);
      const origin = process.env.NODE_ENV === `development` ? `http://${backend.host}` : `https://${backend.host}`;

      const handleSuccess = (data: { user: any }) => {
        resolve(data.user);

        cleanup();
      };

      const handleFailure = (code: string) => {
        reject({
          code: code,
          error: code,
          status: undefined,
          message: undefined,
        });

        cleanup();
      };

      const handleMessage = (event: MessageEvent) => {
        if (event.origin === origin) {
          const data = JSON.parse(event.data);

          popup?.close();

          if (data) {
            if (data.status === `success`) {
              const { data: userData } = data;

              handleSuccess(userData);
            } else {
              handleFailure(data.error ?? `UNKNOWN_ERROR`);
            }
          } else {
            handleFailure(`UNKNOWN_ERROR`);
          }
        }
      };

      poll = window.setInterval(() => {
        // !== is required for compatibility with Opera
        if (popup && popup.closed !== false) {
          window.clearInterval(poll);
          handleClosed();
          resolve(undefined);
        }
      }, 500);

      window.addEventListener(`close`, handleClosed);
      window.addEventListener(`unload`, handleClosed);
      window.addEventListener(`message`, handleMessage);
    })
      .then((user) => {
        if (user) {
          setUser(user);
        }

        return user;
      })
      .finally(() => {
        setLoading(undefined);
      });
  };

  return { handleOAuthSignin };
}

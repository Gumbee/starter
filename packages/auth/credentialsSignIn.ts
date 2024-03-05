import { ROUTES } from '@forge/api/routes';
import { User } from '@forge/database';
import { useLoading, useSetLoading, useSetUser } from './store/hooks';
import { api } from '@forge/api/client';
import { AuthStore } from './store';

export type CredentialsSignInHook = {
  handleSignIn: (email: string, password: string) => Promise<User>;
};

export function useCredentialsSignIn(): CredentialsSignInHook {
  const setUser = useSetUser();
  const setLoading = useSetLoading();

  const handleSignIn = (email: string, password: string): Promise<any> => {
    setLoading('credentials');

    return api
      .post<User>(ROUTES.getCredentialsSignInRoute(), { email, password })
      .then((x) => x.data)
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

  return { handleSignIn };
}

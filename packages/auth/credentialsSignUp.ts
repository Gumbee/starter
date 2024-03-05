import { ROUTES } from '@forge/api/routes';
import { User } from '@forge/database';
import { useLoading, useSetLoading, useSetUser } from './store/hooks';
import { api } from '@forge/api/client';

export type CredentialsSignUpHook = {
  handleSignUp: (email: string, password: string) => Promise<User>;
};

export function useCredentialsSignUp(): CredentialsSignUpHook {
  const setUser = useSetUser();
  const setLoading = useSetLoading();

  const handleSignUp = (email: string, password: string): Promise<any> => {
    setLoading('credentials');

    return api
      .post<User>(ROUTES.getCredentialsSignUpRoute(), { email, password })
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

  return { handleSignUp };
}

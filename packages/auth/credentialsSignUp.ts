import { ROUTES } from '@forge/api/routes';
import { User } from '@forge/database';
import { useLoading, useSetLoading, useSetUser } from './store/hooks';
import { api } from '@forge/api/client';
import { Optional } from '@forge/common/types';

type Dto = {
  email: string;
  password: string;
  name: Optional<string>;
  entryCode?: string;
};

export type CredentialsSignUpHook = {
  handleSignUp: (data: Dto) => Promise<User>;
};

export function useCredentialsSignUp(): CredentialsSignUpHook {
  const setUser = useSetUser();
  const setLoading = useSetLoading();

  const handleSignUp = (data: Dto): Promise<User> => {
    setLoading('credentials');

    return api
      .post<User>(ROUTES.getCredentialsSignUpRoute(), data)
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

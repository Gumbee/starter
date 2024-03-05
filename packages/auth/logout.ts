import { api } from '@forge/api/client';
import { ROUTES } from '@forge/api/routes';
import { useLoading, useSetLoading, useSetUser } from '.';
import { AuthStore } from './store';

type LogoutHook = {
  logout: () => Promise<any>;
  loading: AuthStore['loading'];
};

export function useLogout(): LogoutHook {
  const setUser = useSetUser();
  const setLoading = useSetLoading();
  const loading = useLoading();

  const logout = async () => {
    if (loading) return;

    setLoading('logout');

    return api
      .post(ROUTES.getSignoutRoute())
      .then(() => {
        setUser(undefined);
      })
      .finally(() => {
        setLoading(undefined);
      });
  };

  return {
    logout,
    loading,
  };
}

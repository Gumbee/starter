import { FC, PropsWithChildren, useEffect, useLayoutEffect, useState } from 'react';
import { useSetInitializing, useSetUser, useSetUserIfEmpty } from '..';
import { useApiUserMe } from '@forge/api/hooks/users';
import { USER_LOCAL_STORAGE_KEY } from '../constants';
import { useIsomorphicLayoutEffect } from 'react-use';
import { User } from '@forge/database';

type AuthProviderProps = PropsWithChildren;

export const AuthProvider: FC<AuthProviderProps> = ({ children }) => {
  const { user, error } = useApiUserMe();
  const setUser = useSetUser();
  const setUserIfEmpty = useSetUserIfEmpty();
  const setInitializing = useSetInitializing();

  useIsomorphicLayoutEffect(() => {
    const store = window.localStorage.getItem(USER_LOCAL_STORAGE_KEY);

    if (store) {
      const user = JSON.parse(store) as User;

      setUserIfEmpty(user);
    }

    setInitializing(false);
  }, []);

  useEffect(() => {
    if (error && error.status === 401) {
      setUser(undefined);
    } else if (user) {
      setUser(user);
    }
  }, [user, error]);

  return children;
};

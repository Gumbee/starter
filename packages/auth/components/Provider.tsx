import { FC, PropsWithChildren, useEffect, useLayoutEffect, useState } from 'react';
import { useSetInitializing, useSetUser, useSetUserIfEmpty } from '..';
import { User } from '@logbook/database';
import { api } from '@logbook/api/client';
import { ROUTES } from '@logbook/api/routes';
import { AxiosError } from 'axios';
import { USER_LOCAL_STORAGE_KEY } from '../constants';
import { useIsomorphicLayoutEffect } from 'react-use';

type AuthProviderProps = PropsWithChildren;

export const AuthProvider: FC<AuthProviderProps> = ({ children }) => {
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
    api
      .get<User>(ROUTES.getUsersMe())
      .then((x) => x.data)
      .then(setUser)
      .catch((e: AxiosError) => {
        const status = e.response?.status ?? 0;

        if (status === 401) {
          // not authorized => token invalid
          setUser(undefined);
        }
      });
  }, []);

  return children;
};

import { FC, PropsWithChildren, useEffect, useLayoutEffect, useState } from 'react';
import { useSetInitializing, useSetUser, useSetUserIfEmpty } from '..';
import { User } from '@forge/database';
import { api } from '@forge/api/client';
import { ROUTES } from '@forge/api/routes';
import { AxiosError } from 'axios';
import { USER_LOCAL_STORAGE_KEY } from '../constants';
import { useIsomorphicLayoutEffect } from 'react-use';
import { ApiError } from '@forge/common/types';

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
      .catch((e: ApiError) => {
        if (e.status === 401) {
          // not authorized => token invalid
          setUser(undefined);
        }
      });
  }, []);

  return children;
};

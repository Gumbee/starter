import { Getter, Mutator } from '@forge/common/types/zustand';
import { User } from '@forge/database';
import { AuthStore } from '..';
import { Optional } from '@forge/common/types';
import { USER_LOCAL_STORAGE_KEY } from '../../constants';
import { mutate } from 'swr';

export const setUser = (set: Mutator<AuthStore>, get: Getter<AuthStore>) => (user: Optional<User>) => {
  const current = get().user;

  if (user) {
    window.localStorage.setItem(USER_LOCAL_STORAGE_KEY, JSON.stringify(user));
  } else {
    window.localStorage.removeItem(USER_LOCAL_STORAGE_KEY);

    if (current) {
      setTimeout(() => {
        // clear after a while to avoid visual flashing while transitioning
        mutate((key) => true, undefined);
      }, 1600);
    }
  }

  return set((x) => ({
    ...x,
    user,
  }));
};

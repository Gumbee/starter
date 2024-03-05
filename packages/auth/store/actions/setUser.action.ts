import { Getter, Mutator } from '@forge/common/types/zustand';
import { User } from '@forge/database';
import { AuthStore } from '..';
import { Optional } from '@forge/common/types';
import { USER_LOCAL_STORAGE_KEY } from '../../constants';

export const setUser = (set: Mutator<AuthStore>, _: Getter<AuthStore>) => (user: Optional<User>) => {
  if (user) {
    window.localStorage.setItem(USER_LOCAL_STORAGE_KEY, JSON.stringify(user));
  } else {
    window.localStorage.removeItem(USER_LOCAL_STORAGE_KEY);
  }

  return set((x) => ({
    ...x,
    user,
  }));
};

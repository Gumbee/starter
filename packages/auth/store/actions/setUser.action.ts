import { Getter, Mutator } from '@logbook/common/types/zustand';
import { User } from '@logbook/database';
import { AuthStore } from '..';
import { Optional } from '@logbook/common/types';
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

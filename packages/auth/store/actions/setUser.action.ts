import { Getter, Mutator } from '@logbook/types/zustand';
import { User } from '@logbook/database';
import { AuthStore } from '..';

export const setUser = (set: Mutator<AuthStore>, _: Getter<AuthStore>) => (user: User) => {
  window.localStorage.setItem('user', JSON.stringify(user));

  return set((x) => ({
    ...x,
    user,
  }));
};

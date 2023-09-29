import { Getter, Mutator } from '@logbook/types/zustand';
import { User } from '@logbook/database';
import { AuthStore } from '..';

export const setUserIfEmpty = (set: Mutator<AuthStore>, _: Getter<AuthStore>) => (user: User) => {
  return set((x) => ({
    ...x,
    user: x.user ?? user,
  }));
};

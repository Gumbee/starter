import { Getter, Mutator } from '@forge/common/types/zustand';
import { User } from '@forge/database';
import { AuthStore } from '..';

export const setUserIfEmpty = (set: Mutator<AuthStore>, _: Getter<AuthStore>) => (user: User) => {
  return set((x) => ({
    ...x,
    user: x.user ?? user,
  }));
};

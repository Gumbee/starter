import { Getter, Mutator } from '@forge/common/types/zustand';
import { User } from '@forge/database';
import { AuthStore } from '..';
import { setUser } from './setUser.action';

export const setUserIfEmpty = (set: Mutator<AuthStore>, get: Getter<AuthStore>) => (user: User) => {
  const s = get();

  if (s.user) return;

  setUser(set, get)(user);
};

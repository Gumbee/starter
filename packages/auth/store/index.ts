import { create } from 'zustand';
import { User } from '@logbook/database';
import { Optional } from '@logbook/types';
import { setUser } from './actions/setUser.action';
import { setUserIfEmpty } from './actions/setUserIfEmpty.action';

export type AuthStore = {
  // state
  user: Optional<User>;
  // actions
  setUser: ReturnType<typeof setUser>;
  setUserIfEmpty: ReturnType<typeof setUserIfEmpty>;
};

export const useAuthStore = create<AuthStore>((set, get) => ({
  // state
  user: undefined,
  // actions
  setUser: setUser(set, get),
  setUserIfEmpty: setUserIfEmpty(set, get),
}));

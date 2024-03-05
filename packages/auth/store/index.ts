import { create } from 'zustand';
import { EAccountProvider, User } from '@forge/database';
import { Optional } from '@forge/common/types';
import { setUser } from './actions/setUser.action';
import { setUserIfEmpty } from './actions/setUserIfEmpty.action';
import { setInitializing } from './actions/setInitializing';
import { setLoading } from './actions/setLoading';
import { OAuthProvider } from '../types';

export type AuthStore = {
  // state
  initializing: boolean;
  loading: Optional<OAuthProvider | 'credentials' | 'logout'>;
  user: Optional<User>;
  // actions
  setUser: ReturnType<typeof setUser>;
  setUserIfEmpty: ReturnType<typeof setUserIfEmpty>;
  setInitializing: ReturnType<typeof setInitializing>;
  setLoading: ReturnType<typeof setLoading>;
};

export const useAuthStore = create<AuthStore>((set, get) => ({
  // state
  initializing: true,
  loading: undefined,
  user: undefined,
  // actions
  setUser: setUser(set, get),
  setUserIfEmpty: setUserIfEmpty(set, get),
  setInitializing: setInitializing(set, get),
  setLoading: setLoading(set, get),
}));

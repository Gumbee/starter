import { Getter, Mutator } from '@logbook/common/types/zustand';
import { AuthStore } from '..';

export const setLoading = (set: Mutator<AuthStore>, _: Getter<AuthStore>) => (x: AuthStore['loading']) => {
  return set((s) => ({
    ...s,
    loading: x,
  }));
};

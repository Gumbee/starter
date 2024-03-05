import { Getter, Mutator } from '@forge/common/types/zustand';
import { AuthStore } from '..';

export const setInitializing = (set: Mutator<AuthStore>, _: Getter<AuthStore>) => (x: boolean) => {
  return set((s) => ({
    ...s,
    initializing: x,
  }));
};

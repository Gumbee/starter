import { Getter, Mutator } from '@forge/common/types';
import { GlobalStepperStore } from '..';
import { scoped } from './scoped';

export const reset = (set: Mutator<GlobalStepperStore>, _: Getter<GlobalStepperStore>) => (id: string) => {
  return set((s) => {
    const state = s.states[id];

    if (!state) return s;

    return scoped(s, id, (q) => ({
      stack: [],
      direction: 'forward',
      step: '',
    }));
  });
};

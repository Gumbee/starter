import { Getter, Mutator } from '@forge/common/types';
import { GlobalStepperStore } from '..';
import { scoped } from './scoped';

export const goBack = (set: Mutator<GlobalStepperStore>, _: Getter<GlobalStepperStore>) => (id: string) => {
  return set((s) => {
    const state = s.states[id];

    if (!state) return s;
    if (state.stack.length < 1) return s;

    return scoped(s, id, (q) => ({
      stack: q.stack.slice(0, -1),
      direction: 'backward',
      step: q.stack[q.stack.length - 2] ?? '',
    }));
  });
};

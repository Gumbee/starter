import { Getter, Mutator } from '@forge/common/types';
import { GlobalStepperStore } from '..';
import { scoped } from './scoped';

export const goToStep = (set: Mutator<GlobalStepperStore>, _: Getter<GlobalStepperStore>) => (id: string, step: string) => {
  return set((s) => {
    return scoped(s, id, (q) => {
      const idx = q.stack.indexOf(step);

      if (idx < 0) {
        return {
          stack: [...q.stack, step].filter((_, i, a) => a.indexOf(_) === i),
          direction: 'forward',
          step,
        };
      }

      return {
        stack: q.stack.slice(0, idx + 1),
        direction: 'backward',
        step,
      };
    });
  });
};

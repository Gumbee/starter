import { GlobalStepperStore } from '..';

/**
 * Scopes state changes to a specific stepper.
 */
export const scoped = (
  state: GlobalStepperStore,
  id: string,
  mutator: (state: GlobalStepperStore['states'][string]) => GlobalStepperStore['states'][string],
) => {
  return {
    ...state,
    states: {
      ...state.states,
      [id]: mutator(state.states[id] ?? { stack: [], step: '' }),
    },
  };
};

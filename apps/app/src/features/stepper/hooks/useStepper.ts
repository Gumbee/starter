import { useCallback, useMemo } from 'react';
import { StepperState, useGlobalStepperStore } from '../store';

type StepperHook = {
  step: string;
  stack: string[];
  direction: 'forward' | 'backward';
  goToStep: (step: string) => void;
  goBack: () => void;
  reset: () => void;
};

const DEFAULT_STEP: StepperState = {
  stack: [],
  direction: 'forward',
  step: '',
};

export function useStepper(id: string): StepperHook {
  const { stack, step, direction } = useGlobalStepperStore((s) => s.states[id] ?? DEFAULT_STEP);

  const goBackGlobal = useGlobalStepperStore((s) => s.goBack);
  const goToStepGlobal = useGlobalStepperStore((s) => s.goToStep);
  const resetGlobal = useGlobalStepperStore((s) => s.reset);

  const goBack = useCallback(() => goBackGlobal(id), [goBackGlobal, id]);
  const goToStep = useCallback((step: string) => goToStepGlobal(id, step), [goToStepGlobal, id]);
  const reset = useCallback(() => resetGlobal(id), [resetGlobal, id]);

  return {
    step,
    stack,
    direction,
    reset,
    goBack,
    goToStep,
  };
}

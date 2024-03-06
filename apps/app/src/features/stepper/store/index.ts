import { create } from 'zustand';
import { goBack } from './actions/goBack.action';
import { goToStep } from './actions/goToStep.action';
import { reset } from './actions/reset.action';

export type StepperState = {
  step: string;
  stack: string[];
  direction: 'forward' | 'backward';
};

export type GlobalStepperStore = {
  states: Record<string, StepperState>;
  // ACTIONS
  reset: ReturnType<typeof reset>;
  goToStep: ReturnType<typeof goToStep>;
  goBack: ReturnType<typeof goBack>;
};

export const useGlobalStepperStore = create<GlobalStepperStore>((set, get) => ({
  states: {},
  // ACTIONS
  reset: reset(set, get),
  goToStep: goToStep(set, get),
  goBack: goBack(set, get),
}));

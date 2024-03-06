import { DependencyList, useCallback, useEffect, useMemo } from 'react';
import { useStepper } from './useStepper';

export function useAutoResetStepper(id: string, dependency: DependencyList) {
  const { reset } = useStepper(id);

  useEffect(() => {
    return () => {
      reset();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, dependency);
}

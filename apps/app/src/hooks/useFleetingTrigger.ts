import { useCallback, useRef, useState } from 'react';

type FleetingTriggerHook = {
  active: boolean;
  trigger: () => Promise<void>;
};

/**
 * A hook that returns a boolean value that is true for a specific duration
 */
export function useFleetingTrigger(duration: number): FleetingTriggerHook {
  const [active, setActive] = useState(false);
  const ref = useRef<ReturnType<typeof setTimeout> | null>(null);

  const trigger = useCallback(() => {
    if (ref.current) return Promise.reject();

    setActive(true);

    return new Promise<void>((resolve) => {
      ref.current = setTimeout(() => {
        setActive(false);

        ref.current = null;

        resolve();
      }, duration);
    });
  }, [duration]);

  return { active, trigger };
}

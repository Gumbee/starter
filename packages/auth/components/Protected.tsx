import { FC, PropsWithChildren, ReactNode, useEffect } from 'react';
import { useUser } from '..';

type ProtectedProps = PropsWithChildren<{
  // if it's a soft protection, the children will still be display even if the condition is not fulfilled
  soft?: boolean;
  // fallback to render if the condition is not fulfilled
  fallback?: ReactNode;
  // action to perform when the condition is not fulfilled
  fallbackAction?: () => void;
  // if inverted, then the condition is that the user is NOT logged in
  inverted?: boolean;
}>;

export const Protected: FC<ProtectedProps> = ({ fallback, fallbackAction, children, inverted = false, soft = false }) => {
  const { user, initializing } = useUser();

  const fulfilled = inverted ? !user : !!user;

  useEffect(() => {
    if (!fulfilled) {
      fallbackAction?.();
    }
  }, [fulfilled]);

  if (initializing) return null;
  if (!fulfilled) return soft ? children : fallback ?? null;

  return children;
};

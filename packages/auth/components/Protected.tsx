import { FC, PropsWithChildren, ReactNode, useEffect } from 'react';
import { useRouter } from 'next/router';
import { PAGES } from '@forge/common/pages';
import { useUser } from '..';

type ProtectedProps = PropsWithChildren<{
  // if it's a soft protection, the children will still be display even if the condition is not fulfilled
  soft?: boolean;
  // fallback to render if the condition is not fulfilled
  fallback?: ReactNode;
  // action to perform when the condition is not fulfilled
  fallbackAction?: () => void;
  // if redirect is set, then the fallbackAction will be to redirect to the login page
  redirect?: string;
  // if inverted, then the condition is that the user is NOT logged in
  inverted?: boolean;
}>;

export const Protected: FC<ProtectedProps> = ({
  fallback,
  fallbackAction,
  children,
  inverted = false,
  soft = true,
  redirect = PAGES.signin(),
}) => {
  const router = useRouter();
  const { user, initializing } = useUser();

  const fulfilled = inverted ? !user : !!user;

  useEffect(() => {
    if (!fulfilled && !initializing) {
      fallbackAction?.();

      if (redirect) {
        router.replace(redirect);
      }
    }
  }, [fulfilled, initializing]);

  if (initializing) return soft ? children : fallback ?? null;
  if (!fulfilled) return soft ? children : fallback ?? null;

  return children;
};

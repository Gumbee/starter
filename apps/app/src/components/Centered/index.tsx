import clsx from 'clsx';
import { FC, PropsWithChildren } from 'react';

type CenteredProps = PropsWithChildren<{
  className?: string;
}>;

export const Centered: FC<CenteredProps> = ({ className, children }) => {
  return <div className={clsx('flex flex-col items-center justify-center', className)}>{children}</div>;
};

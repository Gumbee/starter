import { PropsWithChildren } from 'react';

export type LayoutProps<T = {}> = PropsWithChildren<T> & {
  className?: string;
  duration?: number;
};

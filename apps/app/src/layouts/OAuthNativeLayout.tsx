import { LayoutProps } from '@/types/layout';
import clsx from 'clsx';
import { FC } from 'react';

type OAuthNativeLayoutProps = LayoutProps;

export const OAuthNativeLayout: FC<OAuthNativeLayoutProps> = ({ children, className }) => {
  return <main className={clsx('flex flex-col w-screen min-h-screen', className)}>{children}</main>;
};

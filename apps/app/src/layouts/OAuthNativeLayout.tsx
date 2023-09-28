import { LayoutProps } from '@/types/layout';
import { FC } from 'react';

type OAuthNativeLayoutProps = LayoutProps;

export const OAuthNativeLayout: FC<OAuthNativeLayoutProps> = ({ children }) => {
  return <main className="flex flex-col w-screen min-h-screen">{children}</main>;
};

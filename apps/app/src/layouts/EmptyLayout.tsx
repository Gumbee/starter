import { Sidebar, SidebarItem } from '@/components/Sidebar';
import { LayoutProps } from '@/types/layout';
import { Books, FadersHorizontal, Pen, ShootingStar } from '@phosphor-icons/react';
import clsx from 'clsx';
import { FC } from 'react';

type EmptyLayoutProps = LayoutProps;

export const EmptyLayout: FC<EmptyLayoutProps> = ({ children, className }) => {
  return <main className={clsx('flex flex-col min-h-screen', className)}>{children}</main>;
};

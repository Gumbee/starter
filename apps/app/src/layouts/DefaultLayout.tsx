import { Sidebar, SidebarItem } from '@/components/Sidebar';
import { LayoutProps } from '@/types/layout';
import { Books, FadersHorizontal, Pen, ShootingStar } from '@phosphor-icons/react';
import clsx from 'clsx';
import { FC } from 'react';

type DefaultLayoutProps = LayoutProps;

const NAV_ITEMS: SidebarItem[] = [
  { href: '/', icon: Pen },
  { href: '/logs', icon: Books },
  { href: '/insights', icon: ShootingStar },
  { href: '/settings', icon: FadersHorizontal },
];

export const DefaultLayout: FC<DefaultLayoutProps> = ({ children, className }) => {
  return (
    <main className={clsx('flex min-h-screen', className)}>
      <div className="p-[32px]">
        <Sidebar items={NAV_ITEMS} />
      </div>

      <div className="flex-1 flex flex-col">{children}</div>
    </main>
  );
};

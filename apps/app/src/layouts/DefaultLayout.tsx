import { LayoutProps } from '@/types/layout';
import { CSSTransition, SwitchTransition } from 'react-transition-group';
import clsx from 'clsx';
import { FC } from 'react';
import { useRouter } from 'next/router';

type DefaultLayoutProps = LayoutProps;

export const DefaultLayout: FC<DefaultLayoutProps> = ({ children, className }) => {
  const router = useRouter();

  return (
    <main className={clsx('flex flex-col min-h-screen', className)}>
      <SwitchTransition mode="out-in">
        <CSSTransition key={router.pathname} classNames="page" timeout={200}>
          <div className="flex-1 flex flex-col">{children}</div>
        </CSSTransition>
      </SwitchTransition>
    </main>
  );
};

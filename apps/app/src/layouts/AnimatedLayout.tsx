import { LayoutProps } from '@/types/layout';
import { useRouter } from 'next/router';
import { FC, RefObject, createRef, useEffect, useRef } from 'react';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import clsx from 'clsx';

type AnimatedLayoutProps = LayoutProps;

export const AnimatedLayout: FC<AnimatedLayoutProps> = ({ children, className, duration = 200 }) => {
  const router = useRouter();
  const pathname = router.pathname;
  const ref = useRef<Record<string, RefObject<HTMLElement>>>({});
  const exit = useRef<number>(duration);
  const scroll = useRef<number>(0);

  const getRef = (key: string) => {
    if (!ref.current[key]) {
      ref.current[key] = createRef();
    }

    return ref.current[key];
  };

  const delay = exit.current - Math.min(duration, exit.current) * 0.5;

  useEffect(() => {
    const onHistoryChange = () => {
      const el = getRef(pathname).current;

      if (el) {
        scroll.current = Math.max(window.scrollY, el?.scrollTop);

        el.style.overflow = 'hidden';
        el.style.position = 'fixed';
        el.style.top = '0px';
        el.style.left = '0px';
        el.style.right = '0px';
        el.style.bottom = '0px';
        el.scrollTop = scroll.current;
      }
    };

    const onStart = () => {
      scroll.current = window.scrollY;
    };

    const onComplete = () => {
      if (scroll.current > 0) {
        // window.scrollTo({
        //   top: 0,
        //   behavior: 'smooth',
        // });
      }
    };

    router.events.on('routeChangeStart', onHistoryChange);
    router.events.on('routeChangeComplete', onComplete);

    return () => {
      router.events.off('routeChangeStart', onHistoryChange);
      router.events.off('routeChangeComplete', onComplete);
    };
  }, [router]);

  useEffect(() => {
    exit.current = duration;
  }, [duration]);

  return (
    <TransitionGroup style={{ position: 'relative' }} className={clsx('flex flex-col min-h-screen', className)}>
      <CSSTransition
        key={pathname}
        classNames={'page'}
        nodeRef={getRef(pathname)}
        timeout={duration + delay}
        onEnter={() => {}}
        onExit={() => {
          const el = getRef(pathname).current;

          if (el) {
            el.scrollTop = scroll.current;
          }
        }}
      >
        <main
          ref={getRef(pathname)}
          className={clsx('flex-1 flex flex-col')}
          style={{
            ['--transition-duration' as string]: `${duration}ms`,
            ['--transition-delay' as string]: `${delay}ms`,
          }}
        >
          {children}
        </main>
      </CSSTransition>
    </TransitionGroup>
  );
};

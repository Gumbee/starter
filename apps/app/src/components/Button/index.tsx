import { FC, ButtonHTMLAttributes, PropsWithChildren, CSSProperties, FunctionComponent, createElement, HTMLAttributes } from 'react';
import { LoadingSpinner } from '../LoadingSpinner';
import styles from './styles.module.css';
import clsx from 'clsx';

type ButtonProps<T> = PropsWithChildren<{
  // use a different element for the button
  as?: T;
  // whether the button is loading
  loading?: boolean;
  // how strong the button should scale when active
  pressScale?: number;
  // button variant
  variant?: 'plain' | 'white' | 'gray' | 'success';
}> &
  ButtonHTMLAttributes<HTMLButtonElement> &
  (T extends FunctionComponent<infer R> ? Omit<R, 'as'> : {});

export const Button = <T,>({
  as,
  children,
  loading = false,
  disabled = false,
  pressScale,
  variant = 'plain',
  className,
  style,
  ...rest
}: ButtonProps<T>) => {
  const Component = (as as FunctionComponent<any>) ?? 'button';

  return (
    <Component
      {...rest}
      className={clsx('relative', styles['button'], styles[`button--${variant}`], className)}
      style={
        {
          ...style,
          '--scaling': pressScale,
        } as CSSProperties
      }
      disabled={disabled}
    >
      <div className={clsx('transition-opacity duration-200 ease-in-out text-center', loading && 'opacity-0')}>{children}</div>

      {loading && (
        <div className="absolute inset-0 flex items-center justify-center">
          <LoadingSpinner className="h-[40%]" />
        </div>
      )}
    </Component>
  );
};

import clsx from 'clsx';
import { FC, InputHTMLAttributes } from 'react';

type InputProps = InputHTMLAttributes<HTMLInputElement>;

export const Input: FC<InputProps> = ({ className, ...rest }) => {
  return (
    <input
      {...rest}
      className={clsx(
        'px-[16px] py-[12px] rounded-[10px] border-[1px] border-black/20 outline-none focus:border-transparent placeholder:text-black/20 placeholder:font-light',
        className,
      )}
    />
  );
};

import { NODE_ENV } from '@/constants/environment';
import dayjs from 'dayjs';
import { CookieOptions } from 'express';

export const AUTH_COOKIE_OPTIONS: CookieOptions = {
  httpOnly: true,
  sameSite: 'strict',
  path: '/',
  secure: NODE_ENV === 'development' ? false : true,
  expires: dayjs().add(14, `days`).toDate(),
};

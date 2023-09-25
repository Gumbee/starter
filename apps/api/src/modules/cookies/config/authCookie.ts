import dayjs from 'dayjs';
import { CookieOptions } from 'express';

export const AUTH_COOKIE_OPTIONS: CookieOptions = {
  httpOnly: true,
  sameSite: 'strict',
  domain: process.env.COOKIE_DOMAIN,
  path: '/',
  secure: process.env.APP_ENV === 'development' ? false : true,
  expires: dayjs().add(14, `days`).toDate(),
};

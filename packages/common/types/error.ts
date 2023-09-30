import { ERROR_CODES } from '../errors';

export type ApiError = {
  code: (typeof ERROR_CODES)[keyof typeof ERROR_CODES];
  message: string;
  status: number;
};

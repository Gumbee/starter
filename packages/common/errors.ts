export const ERROR_CODES = {
  // COMMON
  UNKNOWN_ERROR: 'UNKNOWN_ERROR',
  FORBIDDEN: 'FORBIDDEN',
  NOT_FOUND: 'NOT_FOUND',
  BAD_PAYLOAD: 'BAD_PAYLOAD',
  UNAUTHORIZED: 'UNAUTHORIZED',
  // SPECIFIC
  ACCOUNT_NOT_FOUND: 'ACCOUNT_NOT_FOUND',
  USER_NOT_FOUND: 'USER_NOT_FOUND',
  USER_EXISTS: 'USER_EXISTS',
  PASSWORD_NOT_SET: 'PASSWORD_NOT_SET',
  INVALID_CREDENTIALS: 'INVALID_CREDENTIALS',
  // OAUTH
  BAD_OAUTH_STATE: 'BAD_OAUTH_STATE',
  // WAITLIST
  INVALID_ENTRY: 'INVALID_ENTRY',
} as const;

type Keys = keyof typeof ERROR_CODES;

export type ErrorCode = (typeof ERROR_CODES)[Keys];

export class ApiError extends Error {
  public code: ErrorCode;
  public status?: number;

  constructor({ code, message, status }: { code: ErrorCode; message: string; status?: number }) {
    super(message);
    this.code = code;
    this.name = 'ApiError';
    this.status = status;
  }
}

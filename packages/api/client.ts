import axios, { AxiosError } from 'axios';
import { API_BASE_URL } from './constants';
import { ERROR_CODES } from '@forge/common/errors';
import { ApiError } from '@forge/common/types';

export const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
});

export const apiSSR = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  headers: { 'Accept-Encoding': 'gzip,deflate,compress' },
});

api.interceptors.response.use(
  (response) => response,
  (error: AxiosError<ApiError>): Promise<ApiError> => {
    // transform error to include default error
    if (error.response?.data) {
      return Promise.reject(error.response.data);
    }

    return Promise.reject({
      code: ERROR_CODES.UNKNOWN_ERROR,
      message: error.message,
      status: 500,
    });
  },
);

apiSSR.interceptors.response.use(
  (response) => response,
  (error: AxiosError<ApiError>): Promise<ApiError> => {
    // transform error to include default error
    if (error.response?.data) {
      return Promise.reject(error.response.data);
    }

    return Promise.reject({
      code: ERROR_CODES.UNKNOWN_ERROR,
      message: error.message,
      status: 500,
    });
  },
);

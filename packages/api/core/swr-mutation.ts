import { ApiError, Maybe } from '@forge/common/types';
import useSWRMutation from 'swr/mutation';
import { api } from '../client';
import { Key } from 'swr';

type Method = 'POST' | 'PUT';

export const apiPoster =
  (method: Method) =>
  (url: string, { arg }: any) => {
    const fn = method === 'POST' ? api.post : api.put;

    return url
      ? fn(url, arg, {
          withCredentials: true,
        }).then((x) => x.data)
      : new Promise((resolve, reject) => {
          reject(new Error(`No endpoint`));
        });
  };

export function useApiSWRMutation<T, D>(
  path: Maybe<string>,
  method?: Method,
  options?: Parameters<typeof useSWRMutation<T, ApiError, Key, D>>[2],
) {
  const fetcher = options?.fetcher ?? apiPoster(method ?? 'POST');

  const { data, error, ...rest } = useSWRMutation<T, ApiError, Key, D>(path ?? null, fetcher as any, options);

  return {
    data,
    error: error,
    ...rest,
  };
}

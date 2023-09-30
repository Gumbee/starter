import { Maybe } from '@logbook/common/types';
import useSWRMutation from 'swr/mutation';
import { api } from './api';

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

export function useApiSWRMutation<T>(path: Maybe<string>, method?: Method, options?: Parameters<typeof useSWRMutation<T>>[2]) {
  const fetcher = options?.fetcher ?? apiPoster(method ?? 'POST');

  const { data, error, ...rest } = useSWRMutation<T>(path ?? null, fetcher as any, options);

  return {
    data,
    error: error,
    ...rest,
  };
}

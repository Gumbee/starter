import useSWR from 'swr';
import { BareFetcher, PublicConfiguration } from 'swr/_internal';
import { api } from '../client';
import { ApiError, Maybe } from '@forge/common/types';

export const apiFetcher = (url: string) =>
  url
    ? api
        .get(url, {
          withCredentials: true,
        })
        .then((x) => x.data)
        .catch((e): any => {
          throw e;
        })
    : new Promise((resolve, reject) => {
        reject(new Error(`No endpoint`));
      });

export function useApiSWR<T>(path: Maybe<string>, options?: Partial<PublicConfiguration<T, any, BareFetcher<T>>>) {
  const fetcher = options?.fetcher ?? apiFetcher;

  const { data, error, isValidating, mutate } = useSWR<T, ApiError>(path ?? null, fetcher as any, options);

  const initialized = !isValidating || !!error || !!data;

  const loading = isValidating && data === undefined;

  return {
    data,
    error,
    loading,
    initialized,
    mutate,
  };
}

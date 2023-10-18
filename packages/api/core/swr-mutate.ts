import { useSWRConfig } from 'swr';

export function useApiSWRMutate() {
  const { mutate } = useSWRConfig();

  const apiMutate = <T>(...args: Parameters<typeof mutate<T>>) => {
    if (typeof args[0] !== 'function') {
      return mutate(args[0], ...args.slice(1));
    }

    const fn = args[0]!;

    const matcher = (key: string) => {
      return fn(key);
    };

    return mutate(matcher, ...args.slice(1));
  };

  return { mutate: apiMutate };
}

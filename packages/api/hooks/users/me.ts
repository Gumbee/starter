import { User } from '@logbook/database';
import { useApiSWR } from '../../core/swr';
import { ROUTES } from '../../routes';

export function useApiUserMe() {
  const { data, ...rest } = useApiSWR<User>(ROUTES.getUsersMe());

  return {
    user: data,
    ...rest,
  };
}

import { User } from '@logbook/database';

export type TokenUser = Pick<User, 'id' | 'avatar' | 'email' | 'role' | 'name'>;

import { User } from '@forge/database';

export type TokenUser = Pick<User, 'id' | 'avatar' | 'email' | 'role' | 'name'>;

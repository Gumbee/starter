import { User } from '@forge/database';

/**
 * list of events that can be emitted by the api
 */
export enum ApiEvent {
  USER_CREATED = 'user.created',
  USER_DELETED = 'user.deleted',
}

/**
 * Event payload types
 */
export type UserCreatedEvent = { user: User };
export type UserDeletedEvent = { user: User };

/**
 * Mapping between events and their payload types
 */
export type ApiEvents = {
  [ApiEvent.USER_CREATED]: UserCreatedEvent;
  [ApiEvent.USER_DELETED]: UserDeletedEvent;
};

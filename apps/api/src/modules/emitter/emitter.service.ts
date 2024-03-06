import { Injectable } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { ApiEvents } from '@/types/events';

/**
 * Typesafe wrapper around EventEmitter2
 */
@Injectable()
export class EmitterService {
  constructor(private eventEmitter: EventEmitter2) {}

  emit<E extends keyof ApiEvents, V extends ApiEvents[E]>(event: E, data: V) {
    return this.eventEmitter.emit(event, data);
  }

  emitAsync<E extends keyof ApiEvents, V extends ApiEvents[E]>(event: E, data: V) {
    return this.eventEmitter.emitAsync(event, data);
  }

  on<E extends keyof ApiEvents, V extends ApiEvents[E]>(event: E, callback: (data: V) => void) {
    return this.eventEmitter.on(event, callback);
  }

  onAny(callback: (event: string, data: any) => void) {
    return this.eventEmitter.onAny(callback as any);
  }

  off<E extends keyof ApiEvents, V extends ApiEvents[E]>(event: E, callback: (data: V) => void) {
    return this.eventEmitter.off(event, callback);
  }

  offAny(callback: (event: string, data: any) => void) {
    return this.eventEmitter.offAny(callback);
  }

  removeAllListeners<E extends keyof ApiEvents>(event?: E) {
    return this.eventEmitter.removeAllListeners(event);
  }
}

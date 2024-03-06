import { Global, Module } from '@nestjs/common';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { EmitterService } from './emitter.service';

@Global()
@Module({
  imports: [EventEmitterModule.forRoot()],
  providers: [EmitterService],
  exports: [EmitterService],
})
export class EmitterModule {}

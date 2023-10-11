import { Module } from '@nestjs/common';
import { HealthService } from './health.service';
import { HealthController } from './health.controller';

@Module({
  providers: [HealthService, HealthController],
  controllers: [HealthController],
  exports: [HealthController],
})
export class HealthModule {}

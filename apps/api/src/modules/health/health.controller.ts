import { Controller, Get, InternalServerErrorException } from '@nestjs/common';
import { HealthService } from './health.service';
import { ERROR_CODES } from '@forge/common/errors';

@Controller('/health')
export class HealthController {
  constructor(private readonly healthService: HealthService) {}

  /**
   * Used by Fargate and the ELB to determine if the service is healthy
   */
  @Get()
  healthy() {
    if (this.healthService.isHealthy()) {
      return { success: true };
    }

    throw new InternalServerErrorException({ code: ERROR_CODES.UNKNOWN_ERROR, message: 'Service is unhealthy' });
  }
}

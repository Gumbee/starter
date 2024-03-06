import { Controller, Get, InternalServerErrorException } from '@nestjs/common';
import { HealthService } from './health.service';
import { ERROR_CODES } from '@forge/common/errors';
import { ApiTags } from '@nestjs/swagger';

@ApiTags(`Health`)
@Controller('/health')
export class HealthController {
  constructor(private readonly healthService: HealthService) {}

  /**
   * Used by Fargate and the ELB to determine if the service is healthy
   */
  @Get()
  async healthy() {
    const healthy = await this.healthService.isHealthy().catch(() => false);

    if (healthy) {
      return { success: true };
    }

    throw new InternalServerErrorException({ code: ERROR_CODES.UNKNOWN_ERROR, message: 'Service is unhealthy' });
  }

  @Get('/status')
  async status() {
    return this.healthService.getStatus();
  }
}

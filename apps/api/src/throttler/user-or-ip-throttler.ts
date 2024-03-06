import { Injectable } from '@nestjs/common';
import { ThrottlerGuard } from '@nestjs/throttler';
import { getClientIp } from '@supercharge/request-ip';

@Injectable()
export class ThrottlerUserOrIPGuard extends ThrottlerGuard {
  protected async getTracker(req: Record<string, any>): Promise<string> {
    return req.user?.id ?? getClientIp(req) ?? 'unknown';
  }
}

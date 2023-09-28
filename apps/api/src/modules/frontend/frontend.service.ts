import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class FrontendService {
  constructor(private config: ConfigService) {}

  getFrontendPath(path: string) {
    return new URL(path, this.config.get('FRONTEND_URL'));
  }
}

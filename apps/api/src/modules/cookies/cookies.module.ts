import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { CookiesService } from './cookies.service';

@Module({
  imports: [JwtModule.register({})],
  providers: [CookiesService],
  exports: [CookiesService],
})
export class CookiesModule {}

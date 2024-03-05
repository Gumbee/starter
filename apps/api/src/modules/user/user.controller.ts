import { User } from '@forge/database';
import { ReqUser } from '@modules/auth/decorators/user.decorator';
import { JwtAuthGuard } from '@modules/auth/guards/jwt-auth.guard';
import { Controller, Get, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('User')
@Controller('users')
export class UserController {
  @Get('/me')
  @UseGuards(JwtAuthGuard)
  async getMe(@ReqUser() user: User) {
    return user;
  }
}

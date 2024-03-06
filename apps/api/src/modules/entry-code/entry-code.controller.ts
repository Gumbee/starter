import { Body, Controller, Get, NotFoundException, Param, Post, UnauthorizedException, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { EntryCodeService } from './entry-code.service';
import { JwtAuthGuard } from '@modules/auth/guards/jwt-auth.guard';
import { ReqUser } from '@modules/auth/decorators/user.decorator';
import { ERROR_CODES } from '@forge/common/errors';
import { canCreateEntryCode } from '@forge/api/authorization';
import { EntryCodeCreateDto } from './dto/entry-code-create.dto';
import { User } from '@forge/database';

@ApiTags('Entry Code')
@Controller('entrycodes')
export class EntryCodeController {
  constructor(private entryCodes: EntryCodeService) {}

  @Get('/:code')
  async getEntryCode(@Param('code') code: string) {
    const entryCode = await this.entryCodes.getEntryCode(code);

    if (!entryCode) {
      throw new NotFoundException({
        code: ERROR_CODES.NOT_FOUND,
        message: 'Entry code not found',
      });
    }

    return entryCode;
  }

  @Post('/')
  @UseGuards(JwtAuthGuard)
  async createEntryCode(@ReqUser() user: User, @Body() body: EntryCodeCreateDto) {
    const canCreate = canCreateEntryCode(user);

    if (!canCreate) {
      throw new UnauthorizedException({
        code: ERROR_CODES.UNAUTHORIZED,
        message: 'You are not authorized to create entry codes',
      });
    }

    return await this.entryCodes.createEntryCode(body.code, body.maxUses);
  }
}

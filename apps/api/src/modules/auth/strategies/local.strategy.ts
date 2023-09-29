import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { UnauthorizedException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { AccountService } from '@modules/account/account.service';
import { EAccountProvider } from '@logbook/database';
import bcrypt from 'bcryptjs';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy, `local`) {
  constructor(private accountService: AccountService) {
    super({ usernameField: `email` });
  }

  async validate(email: string, password: string): Promise<any> {
    const account = await this.accountService.findByEmailAndProvider(email, EAccountProvider.LOCAL);

    if (!account) {
      throw new NotFoundException('No user account found');
    }

    if (!account.password) {
      throw new InternalServerErrorException('No password set');
    }

    if (account && (await bcrypt.compare(password, account.password))) {
      return account;
    }

    throw new UnauthorizedException('Invalid credentials');
  }
}

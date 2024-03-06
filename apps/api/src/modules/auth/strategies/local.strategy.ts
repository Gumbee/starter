import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { UnauthorizedException, Injectable, InternalServerErrorException, NotFoundException, BadRequestException } from '@nestjs/common';
import { AccountService } from '@modules/account/account.service';
import { EAccountProvider } from '@forge/database';
import bcrypt from 'bcryptjs';
import { ERROR_CODES } from '@forge/common/errors';
import { isEmail } from 'class-validator';
import { UserService } from '@modules/user/user.service';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy, `local`) {
  constructor(
    private accountService: AccountService,
    private userService: UserService,
  ) {
    super({ usernameField: `email` });
  }

  async validate(email: string, password: string): Promise<any> {
    if (!email) throw new BadRequestException({ code: ERROR_CODES.BAD_PAYLOAD, message: 'Email not provided' });
    if (!isEmail(email)) throw new BadRequestException({ code: ERROR_CODES.BAD_PAYLOAD, message: 'Email is invalid' });
    if (!password) throw new BadRequestException({ code: ERROR_CODES.BAD_PAYLOAD, message: 'Password not provided' });

    const account = await this.accountService.findByEmailAndProvider(email, EAccountProvider.LOCAL);

    if (!account) {
      throw new NotFoundException({ code: ERROR_CODES.ACCOUNT_NOT_FOUND, message: 'Account not found' });
    }

    if (!account.password) {
      throw new InternalServerErrorException({ code: ERROR_CODES.PASSWORD_NOT_SET, message: 'Password not set' });
    }

    if (account && (await bcrypt.compare(password, account.password))) {
      const user = await this.userService.findById(account.user.id);

      if (!user) {
        throw new NotFoundException({ code: ERROR_CODES.UNKNOWN_ERROR, message: 'User could not be found for some reason' });
      }

      return user;
    }

    throw new UnauthorizedException({ code: ERROR_CODES.INVALID_CREDENTIALS, message: 'Invalid credentials' });
  }
}

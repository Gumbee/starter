import { Account, EAccountProvider, User } from '@forge/database';
import { Injectable } from '@nestjs/common';
import { CredentialsSignupDTO } from './dto/credentials-signup.dto';
import { AccountService } from '@modules/account/account.service';
import { SALT_ROUNDS } from './config';
import { Profile as GoogleProfile } from 'passport-google-oauth20';
import bcrypt from 'bcryptjs';
import { UserService } from '@modules/user/user.service';

@Injectable()
export class AuthService {
  constructor(
    private accountService: AccountService,
    private userService: UserService,
  ) {}

  async doesUserExist(email: string): Promise<boolean> {
    return this.userService.findByEmail(email).then((x) => !!x);
  }

  async createAccountFromCredentials(credentials: CredentialsSignupDTO): Promise<Account & { user: User }> {
    const hashedPassword = await bcrypt.hash(credentials.password, SALT_ROUNDS);

    const account = this.accountService.create({
      password: hashedPassword,
      provider: EAccountProvider.LOCAL,
      user: {
        connectOrCreate: {
          where: {
            email: credentials.email,
          },
          create: {
            email: credentials.email,
          },
        },
      },
    });

    return account;
  }

  async createAccountFromGoogle(
    profile: GoogleProfile,
    accessToken: string,
    refreshToken: string,
    scope: string[],
  ): Promise<Account & { user: User }> {
    const { id, displayName, emails, photos } = profile;

    const email = emails && emails.length > 0 ? emails[0].value : undefined;
    const avatar = photos?.[0].value;

    if (!email) throw new Error('No email found in google profile');

    const account = this.accountService.create({
      provider: EAccountProvider.GOOGLE,
      providerAccountId: id,
      access_token: accessToken,
      refresh_token: refreshToken,
      scope,
      user: {
        connectOrCreate: {
          where: {
            email: email,
          },
          create: {
            email: email,
            name: displayName,
            avatar,
          },
        },
      },
    });

    return account;
  }

  async findGoogleAccount(profile: GoogleProfile) {
    const { emails } = profile;

    const email = emails && emails.length > 0 ? emails[0].value : undefined;

    if (!email) throw new Error('No email found in google profile');

    return this.accountService.findByEmailAndProvider(email, EAccountProvider.GOOGLE);
  }
}

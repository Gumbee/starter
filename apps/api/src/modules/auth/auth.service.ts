import { Account, EAccountProvider, EntryCode, User } from '@forge/database';
import { Injectable } from '@nestjs/common';
import { CredentialsSignupDTO } from './dto/credentials-signup.dto';
import { AccountService } from '@modules/account/account.service';
import { SALT_ROUNDS } from './config';
import { Profile as GoogleProfile } from 'passport-google-oauth20';
import bcrypt from 'bcryptjs';
import { UserService } from '@modules/user/user.service';
import { EmitterService } from '@modules/emitter/emitter.service';
import { ApiEvent } from '@/types/events';
import { Maybe, Optional } from '@forge/common/types';
import { EntryCodeService } from '@modules/entry-code/entry-code.service';
import { v4 as uuid } from 'uuid';

@Injectable()
export class AuthService {
  constructor(
    private accountService: AccountService,
    private userService: UserService,
    private entryCodeService: EntryCodeService,
    private emitter: EmitterService,
  ) {}

  async doesUserExist(email: string): Promise<boolean> {
    return this.userService.findByEmail(email).then((x) => !!x);
  }

  async createAccountFromCredentials(credentials: CredentialsSignupDTO, entry?: Maybe<EntryCode>): Promise<Account & { user: User }> {
    const hashedPassword = await bcrypt.hash(credentials.password, SALT_ROUNDS);

    const orgId = uuid();
    const account = await this.accountService.create({
      password: hashedPassword,
      provider: EAccountProvider.LOCAL,
      user: {
        connectOrCreate: {
          where: {
            email: credentials.email,
          },
          create: {
            id: orgId,
            email: credentials.email,
            name: credentials.name,
          },
        },
      },
    });

    this.emitter.emit(ApiEvent.USER_CREATED, {
      user: account.user,
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

    const account = await this.accountService.create({
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

    this.emitter.emit(ApiEvent.USER_CREATED, {
      user: account.user,
    });

    return account;
  }

  async findGoogleAccount(profile: GoogleProfile) {
    const { emails } = profile;

    const email = emails && emails.length > 0 ? emails[0].value : undefined;

    if (!email) throw new Error('No email found in google profile');

    return this.accountService.findByEmailAndProvider(email, EAccountProvider.GOOGLE);
  }

  async isEntryValid({ entryCode }: { entryCode: Optional<string> }) {
    let valid = false;
    let entry: Maybe<EntryCode> = null;

    if (entryCode) {
      const { isValid, code } = await this.entryCodeService.isValid(entryCode);

      if (isValid) {
        entry = code;
        valid = true;
      }
    }

    return { valid, entry };
  }
}

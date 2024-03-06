import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { ParameterMissingException } from 'src/exceptions/parameter-missing-exception';
import { Prisma, EAccountProvider, User, Account } from '@forge/database';
import { Optional } from '@forge/common/types';

@Injectable()
export class AccountService {
  constructor(private prisma: PrismaService) {}

  async create(input: Omit<Prisma.AccountCreateInput, 'id' | 'createdAt' | 'updatedAt'>) {
    return this.prisma.account.create({
      data: {
        ...input,
      },
      include: {
        user: true,
      },
    });
  }

  /**
   * Return the account (of a given provider type) associated with the given email
   */
  async findByEmailAndProvider(email: string, provider: EAccountProvider) {
    ParameterMissingException.throwUnlessExists(email, 'email');
    ParameterMissingException.throwUnlessExists(provider, 'provider');

    return this.prisma.account.findFirst({
      where: {
        provider,
        user: {
          email,
        },
      },
      include: {
        user: true,
      },
    });
  }
}

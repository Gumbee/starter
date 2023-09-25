import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { ParameterMissingException } from 'src/exceptions/parameter-missing-exception';
import { Account, EAccountProvider } from '@logbook/database';

@Injectable()
export class AccountsService {
  constructor(private prisma: PrismaService) {}

  async create(input: Omit<Account, 'createdAt' | 'updatedAt'>) {
    return this.prisma.account.create({
      data: {
        ...input,
      },
    });
  }

  /**
   * Return the account (of a given provider type) associated with the given email
   */
  async findByEmailAndProvider(email: string, provider: EAccountProvider): Promise<Account> {
    ParameterMissingException.throwUnlessExist(email, provider);

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

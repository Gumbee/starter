import { ParameterMissingException } from '@/exceptions/parameter-missing-exception';
import { ENTRY_CODE_LENGTH } from '@forge/common/constants';
import { ApiError, ERROR_CODES } from '@forge/common/errors';
import { PrismaService } from '@modules/prisma/prisma.service';
import { Injectable } from '@nestjs/common';

@Injectable()
export class EntryCodeService {
  constructor(private prisma: PrismaService) {}

  async createEntryCode(code?: string, maxUses?: number) {
    if (code?.length !== ENTRY_CODE_LENGTH)
      throw new ApiError({
        code: ERROR_CODES.BAD_PAYLOAD,
        message: 'Invalid code length',
        status: 400,
      });

    return this.prisma.entryCode.create({
      data: {
        code:
          code ??
          Math.random()
            .toString(36)
            .substring(ENTRY_CODE_LENGTH + 1),
        maxUses: maxUses,
      },
    });
  }

  async isValid(code: string) {
    ParameterMissingException.throwUnlessExists(code, 'code');

    const entryCode = await this.getEntryCode(code);

    return {
      code: entryCode,
      isValid: !!entryCode && (!entryCode.maxUses || entryCode.uses < entryCode.maxUses),
    };
  }

  async getEntryCode(code: string) {
    ParameterMissingException.throwUnlessExists(code, 'code');

    return this.prisma.entryCode.findUnique({
      where: {
        code: code.toLocaleLowerCase(),
      },
    });
  }

  async consumeEntryCode(code: string) {
    ParameterMissingException.throwUnlessExists(code, 'code');

    const entryCode = await this.getEntryCode(code);

    if (!entryCode) {
      throw new ApiError({
        code: ERROR_CODES.NOT_FOUND,
        message: 'Entry code not found',
        status: 404,
      });
    } else if (entryCode.maxUses && entryCode.uses >= entryCode.maxUses) {
      throw new ApiError({
        code: ERROR_CODES.FORBIDDEN,
        message: 'Entry code has reached its maximum uses',
        status: 400,
      });
    }

    return this.prisma.entryCode.update({
      where: {
        code: code.toLocaleLowerCase(),
      },
      data: {
        uses: {
          increment: 1,
        },
      },
    });
  }
}

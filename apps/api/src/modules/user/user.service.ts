import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { ParameterMissingException } from 'src/exceptions/parameter-missing-exception';
import { Optional } from '@forge/common/types';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async findById(id: string) {
    ParameterMissingException.throwUnlessExists(id, 'id');

    return this.prisma.user.findFirst({
      where: {
        id,
      },
    });
  }

  async findByEmail(email: string) {
    ParameterMissingException.throwUnlessExists(email, 'email');

    return this.prisma.user.findFirst({
      where: {
        email,
      },
    });
  }

  async updateById(id: string, data: Partial<{ name: Optional<string>; entryCode: string }>) {
    ParameterMissingException.throwUnlessExists(id, 'id');

    const updated = await this.prisma.user.update({
      where: {
        id,
      },
      data: {
        name: data.name,
        entry: data.entryCode,
      },
    });

    return updated;
  }
}

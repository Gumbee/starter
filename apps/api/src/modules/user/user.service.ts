import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { ParameterMissingException } from 'src/exceptions/parameter-missing-exception';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async findById(id: string) {
    ParameterMissingException.throwUnlessExist(id);

    return this.prisma.user.findFirst({
      where: {
        id,
      },
    });
  }

  async findByEmail(email: string) {
    ParameterMissingException.throwUnlessExist(email);

    return this.prisma.user.findFirst({
      where: {
        email,
      },
    });
  }
}

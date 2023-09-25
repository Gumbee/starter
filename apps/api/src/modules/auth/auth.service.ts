import { User } from '@logbook/database';
import { Injectable, NotImplementedException } from '@nestjs/common';
import { CredentialsSignupDTO } from './dto/credentials-signup.dto';

@Injectable()
export class AuthService {
  async signupWithCredentials(credentials: CredentialsSignupDTO): Promise<User> {
    throw new NotImplementedException('Not implemented yet');
  }
}

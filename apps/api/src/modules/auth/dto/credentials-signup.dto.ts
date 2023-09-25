import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class CredentialsSignupDTO {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  password: string;
}

import { Optional } from '@forge/common/types';
import { IsEmail, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CredentialsSignupDTO {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  password: string;

  @IsString()
  @IsOptional()
  name: Optional<string>;

  @IsString()
  @IsOptional()
  entryCode: Optional<string>;
}

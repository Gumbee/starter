import { Optional } from '@forge/common/types';
import { IsInt, IsOptional, IsPositive, IsString } from 'class-validator';

export class EntryCodeCreateDto {
  @IsString()
  @IsOptional()
  code: Optional<string>;

  @IsInt()
  @IsPositive()
  @IsOptional()
  maxUses: Optional<number>;
}

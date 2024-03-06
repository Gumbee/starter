import { Module } from '@nestjs/common';
import { EntryCodeController } from './entry-code.controller';
import { EntryCodeService } from './entry-code.service';

@Module({
  controllers: [EntryCodeController],
  providers: [EntryCodeService],
  exports: [EntryCodeService],
})
export class EntryCodeModule {}

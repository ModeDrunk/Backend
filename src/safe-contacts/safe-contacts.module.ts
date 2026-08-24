import { Module } from '@nestjs/common';
import { SafeContactsService } from './safe-contacts.service';
import { SafeContactsController } from './safe-contacts.controller';

@Module({
  controllers: [SafeContactsController],
  providers: [SafeContactsService],
  exports: [SafeContactsService],
})
export class SafeContactsModule {}

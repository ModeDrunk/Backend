import { Module } from '@nestjs/common';
import { DrunkModeService } from './drunk-mode.service';
import { DrunkModeController } from './drunk-mode.controller';

@Module({
  controllers: [DrunkModeController],
  providers: [DrunkModeService],
  exports: [DrunkModeService],
})
export class DrunkModeModule {}

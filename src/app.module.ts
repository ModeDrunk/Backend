import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { DrunkModeModule } from './drunk-mode/drunk-mode.module';
import { SafeContactsModule } from './safe-contacts/safe-contacts.module';
import { JwtAuthGuard } from './common/guards/jwt-auth.guard';

@Module({
  imports: [PrismaModule, AuthModule, DrunkModeModule, SafeContactsModule],
  controllers: [],
  providers: [
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
  ],
})
export class AppModule {}

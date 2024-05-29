import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/infrastructure/users.module';
import { EnvConfigModule } from './shared/infrastructure/env-config/env-config.module';
import { DatabaseModule } from './shared/infrastructure/database/database.module';
import { APP_GUARD, Reflector } from '@nestjs/core';
import { AuthGuard } from './auth/infrastructure/auth.guard';
import { AuthModule } from './auth/infrastructure/auth.module';

@Module({
  imports: [UsersModule, EnvConfigModule, DatabaseModule, AuthModule],
  controllers: [AppController],
  providers: [
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
    Reflector,
    AppService,
  ],
})
export class AppModule {}

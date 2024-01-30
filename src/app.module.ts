import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { AccessTokenGuard } from './auth/guards/jwt-access.guard';
import { AuthModule } from './auth/auth.module';
import { HelicopterModule } from './modules/helicopter/helicopter.module';
import { AdventureOperatingTimeModule } from './modules/adventure-operating-time/adventure-operating-time.module';
import { FlightScheduleModule } from './modules/flight-schedule/flight-schedule.module';
import { RouteModule } from './modules/route/route.module';
import { UserModule } from './modules/user/user.module';
import { UserFlightScheduleModule } from './modules/user-flight-schedule/user-flight-schedule.module';
import { WorkScheduleModule } from './modules/work-schedule/work-schedule.module';
import { ConfigurationModule } from './modules/configuration/configuration.module';

@Module({
  imports: [
    AuthModule,
    UserModule,
    HelicopterModule,
    RouteModule,
    AdventureOperatingTimeModule,
    FlightScheduleModule,
    UserFlightScheduleModule,
    WorkScheduleModule,
    ConfigurationModule,
    ConfigModule.forRoot({ isGlobal: true }),
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: AccessTokenGuard,
    },
  ],
})
export class AppModule {}

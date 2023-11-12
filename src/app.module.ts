import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './modules/user/entity/user.entity';
import { ConfigModule } from '@nestjs/config';
import { Permission } from './modules/permission/entity/permission.entity';
import { RolePermission } from './modules/role-permission/entity/role-permission.entity';
import { Role } from './modules/role/entity/role.entity';
import { UserRole } from './modules/user-role/entity/user-role.entity';
import { APP_GUARD } from '@nestjs/core';
import { AccessTokenGuard } from './auth/guards/jwt-access.guard';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.localhost,
      port: Number(process.env.port),
      username: 'root',
      password: 'Son12345',
      database: 'airports',
      entities: [
        User,
        Permission,
        RolePermission,
        Role,
        UserRole,
      ],
      synchronize: true,
    }),
    AuthModule,
    ConfigModule.forRoot(),
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

import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { JwtPayload } from '../types/jwt-payload.dto';
import { Request } from 'express';
import { PrismaService } from 'src/prisma/prisma.service';
import { Reflector } from '@nestjs/core';

@Injectable()
export class AccessTokenStratey extends PassportStrategy(Strategy, 'jwt') {
  constructor(
    public config: ConfigService,
    private readonly prisma: PrismaService,
    private reflector: Reflector,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: config.get('ACCESS_TOKEN_SECRET'),
      passReqToCallback: true, //pass to validate below
    });
  }

  // async validate(req: Request, payload: JwtPayload) {
  async validate(req: any, payload: any) {
    const userFound = await this.prisma.user.findUnique({
      where: { email: payload.data.email },
    });
    const token = req.headers?.authorization?.replace('Bearer', '').trim();
    const isPermission = req.role.includes(payload.data.role);

    if (userFound.accessToken !== token || !isPermission) {
      throw new UnauthorizedException();
    }

    return payload; //attach to request object
  }
}

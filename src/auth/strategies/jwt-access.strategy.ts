import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { JwtPayload } from '../types/jwt-payload.dto';
import { Request } from 'express';

@Injectable()
export class AccessTokenStratey extends PassportStrategy(Strategy, 'jwt') {
  constructor(public config: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: config.get('ACCESS_TOKEN_SECRET'),
      passReqToCallback: true, //pass to validate below
    });
  }

  validate(req: Request, payload: JwtPayload) {
    console.log('Stratey validate');
    return payload; //attach to request object
  }
}

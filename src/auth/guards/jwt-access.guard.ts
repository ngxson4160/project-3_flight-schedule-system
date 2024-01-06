import {
  ExecutionContext,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class AccessTokenGuard extends AuthGuard('jwt') {
  constructor(private reflector: Reflector) { 
    super();
  }

  // canActivate(context: ExecutionContext) {
  //   const permissions = this.reflector.getAllAndOverride<boolean>("permissions", [
  //     context.getHandler(),
  //     context.getClass(),
  //   ]);

  //   if (!permissions) {
  //     return true;
  //   }
  //   return super.canActivate(context);
  // }

  canActivate(context: ExecutionContext) {
    const role = this.reflector.getAllAndOverride<boolean>("role", [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!role) {
      return true;
    }
    return super.canActivate(context);
  }
}

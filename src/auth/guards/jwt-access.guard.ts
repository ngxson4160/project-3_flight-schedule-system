import { ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class AccessTokenGuard extends AuthGuard('jwt') {
  constructor(private reflector: Reflector) {
    super();
  }

  async canActivate(context: ExecutionContext): Promise<any> {
    const req = context.switchToHttp().getRequest();

    const role = this.reflector.getAllAndOverride<boolean>('role', [
      context.getHandler(),
      context.getClass(),
    ]);

    req.role = role;

    if (!role) {
      return true;
    }
    return super.canActivate(context);
  }
}

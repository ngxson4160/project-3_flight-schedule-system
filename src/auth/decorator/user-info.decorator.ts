import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const UserData = createParamDecorator(
  (data: string, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const user = request.user;
    if (user?.data) {
      return user.data;
    } else {
      return { id: 0, email: '' };
    }
  },
);

import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { IAuthUser } from '@src/interfaces';

export const AuthUser = createParamDecorator(
  (_data: unknown, ctx: ExecutionContext): IAuthUser => {
    return ctx.switchToHttp().getRequest().authUser;
  },
);

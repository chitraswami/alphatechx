import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { AuthUser } from './auth.guard';

export const CurrentUser = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): AuthUser | undefined => {
    const request = ctx.switchToHttp().getRequest();
    return request.user as AuthUser | undefined;
  },
); 
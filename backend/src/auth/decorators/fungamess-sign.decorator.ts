import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const FungamessSign = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    return request['x-fungamess-sign'];
  },
);

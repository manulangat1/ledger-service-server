import { createParamDecorator, ExecutionContext } from '@nestjs/common';

// export const CurrentUser = createParamDecorator(
//   (_data: unknown, context: ExecutionContext) => {
//     const request: any = context.switchToHttp().getRequest();
//     // TODO: come up with an authorized user dto.
//     const data = request.user;
//     return data;
//   },
// );

export const CurrentUser = createParamDecorator(
  (_data: unknown, context: ExecutionContext) => {
    const request: any = context.switchToHttp().getRequest();
    const data = request.user;
    return data;
  },
);

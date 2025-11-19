import { Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';

@Injectable()
export class TrimmerMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction): void {
    const removeTrailingSpaces = (
      input: string | Record<string, any>,
    ): string | Record<string, any> => {
      if (typeof input === 'string') return input.trim();
      if (input != null && typeof input === 'object') {
        Object.keys(input).forEach((key) => {
          input[key] = removeTrailingSpaces(input[key]);
        });
      }
      return input;
    };

    req.body = removeTrailingSpaces(req.body);
    next();
  }
}

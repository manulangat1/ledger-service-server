import {
  BadRequestException,
  Injectable,
  NestMiddleware,
} from '@nestjs/common';
import { isNotIn } from 'class-validator';
import { NextFunction, Request, Response } from 'express';
import {
  ALLOWED_CHARS_AND_EMAIL_REGEX,
  ALLOWED_CHARS_REGEX,
  EMAIL,
  PASSWORD,
} from '../constants/general.constants';

@Injectable()
export class AntiSpecialCharsMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction): void {
    let invalidSpecialCharacters: string[] = [];

    const validateSpecialCharacters = (input: any, key?: string): void => {
      if (key && typeof input === 'string') {
        if (isNotIn(key, [PASSWORD])) {
          const illegalCharacters: string[] =
            input.match(
              key === EMAIL
                ? ALLOWED_CHARS_AND_EMAIL_REGEX
                : ALLOWED_CHARS_REGEX,
            ) ?? [];

          if (illegalCharacters && illegalCharacters.length)
            invalidSpecialCharacters =
              invalidSpecialCharacters.concat(illegalCharacters);
        }
      }

      // When the input is a nested object or an array, validate it recursively
      if (input !== null && typeof input === 'object')
        Object.keys(input).forEach((item) =>
          validateSpecialCharacters(input[item], item),
        );
    };

    // Call the callback to validate the request body
    validateSpecialCharacters(req.body);

    if (invalidSpecialCharacters.length) {
      throw new BadRequestException(
        `The following character${
          invalidSpecialCharacters.length > 1 ? "s aren't" : " isn't"
        } allowed: ${invalidSpecialCharacters}`,
      );
    }

    next();
  }
}

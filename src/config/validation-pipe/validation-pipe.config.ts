import { BadRequestException, ValidationPipeOptions } from "@nestjs/common";
import { ValidationError } from "class-validator";

export const ValidationPipeConfig: ValidationPipeOptions = {
  exceptionFactory: (validationErrors: ValidationError[]) => {
    const messages = validationErrors
      .flatMap(err => (err.constraints ? Object.values(err.constraints) : []))
      .join(". ");

    return new BadRequestException(messages);
  },
  whitelist: true,
  forbidNonWhitelisted: true,
  forbidUnknownValues: true,

  disableErrorMessages: false,

  validationError: {
    value: false,
  },

  transform: true,
};

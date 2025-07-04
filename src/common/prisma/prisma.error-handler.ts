import { HttpException, Logger } from "@nestjs/common";

export function PrismaErrorHandler(): MethodDecorator {
  return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
    const originalMethod = descriptor.value;

    descriptor.value = async function (...args: any[]) {
      try {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-return,@typescript-eslint/no-unsafe-call
        return await originalMethod.apply(this, args);
      } catch (error) {
        switch (error.code) {
          case "P2025":
            throw new HttpException(`Record not found: ${error.message}`, 400);
          case "P2002":
            throw new HttpException(`Duplicate field value: ${error.meta.target}`, 400);
          case "P2014":
            throw new HttpException(`Invalid ID: ${error.meta.target}`, 400);
          case "P2003":
            throw new HttpException(`Invalid input data: ${error.meta.target}`, 400);
          default:
            Logger.log(error.code);
            Logger.log(error.meta?.target);
            Logger.log(error.message);
            throw new HttpException(`Something went wrong: ${error.message}`, 500);
        }
      }
    };
    return descriptor;
  };
}

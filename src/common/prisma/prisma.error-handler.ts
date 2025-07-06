import { HttpException, Logger } from "@nestjs/common";

export function PrismaErrorHandler(): MethodDecorator {
  return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
    const originalMethod = descriptor.value;

    descriptor.value = async function (...args: any[]) {
      try {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-return,@typescript-eslint/no-unsafe-call
        return await originalMethod.apply(this, args);
      } catch (error) {
        Logger.error("PrismaErrorHandler caught error:");
        Logger.error("Error type:", error.constructor.name);
        Logger.error("Error code:", error.code);
        Logger.error("Error message:", error.message);
        Logger.error("Error meta:", error.meta);
        Logger.error("Full error object:", error);

        if (error.code) {
          switch (error.code) {
            case "P2025":
              throw new HttpException(`Record not found: ${error.message}`, 404);
            case "P2002":
              throw new HttpException(
                `Duplicate field value: ${error.meta?.target}`,
                400,
              );
            case "P2014":
              throw new HttpException(`Invalid ID: ${error.meta?.target}`, 400);
            case "P2003":
              throw new HttpException(`Invalid input data: ${error.meta?.target}`, 400);
            default:
              Logger.error(`Unhandled Prisma error code: ${error.code}`);
              throw new HttpException(`Database error: ${error.message}`, 500);
          }
        } else {
          Logger.error(
            "Error does not have a code property, might not be a Prisma error",
          );
          throw new HttpException(`Something went wrong: ${error.message}`, 500);
        }
      }
    };
    return descriptor;
  };
}

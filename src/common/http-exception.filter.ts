import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from "@nestjs/common";
import { Request } from "express";

@Catch(HttpException)
export class HttpExceptionFilter<T> implements ExceptionFilter {
  catch(exception: T, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const request = ctx.getRequest();

    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    // eslint-disable-next-line @typescript-eslint/no-unsafe-call
    response.status(status).json(this.customResponse(status, request, exception));
  }

  private customResponse(status: number, request: Request, exception: any) {
    return {
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request?.url,
      method: request?.method,
      params: request?.params,
      query: request?.query,
      exception: {
        name: exception["name"],
        message: exception["message"],
      },
    };
  }
}

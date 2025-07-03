import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  const port = configService.get("SERVICE_PORT");

  // app.useGlobalFilters(new HttpExceptionFilter());
  // app.useGlobalPipes(new ValidationPipe(ValidationPipeConfig));

  // SwaggerModule.setup("swagger", app, getDocumentFactory(app), {
  //   jsonDocumentUrl: "swagger/json",
  // });

  await app.listen(port ?? 3000);
  Logger.log(`🚀 Application is running on the port ${port}`);
}
bootstrap();
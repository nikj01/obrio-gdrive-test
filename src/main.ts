import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { INestApplication, Logger, ValidationPipe } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { HttpExceptionFilter } from "./common/http-exception.filter";
import { ValidationPipeConfig } from "@app/config/validation-pipe/validation-pipe.config";
import { SwaggerModule } from "@nestjs/swagger";
import { getSwaggerConfig } from "@app/config/swagger/swagger.config";

async function bootstrap() {
  const app: INestApplication = await NestFactory.create(AppModule);
  const configService: ConfigService = app.get(ConfigService);
  const port: number = configService.get<number>("SERVICE_PORT", 3000);

  app.useGlobalFilters(new HttpExceptionFilter());
  app.useGlobalPipes(new ValidationPipe(ValidationPipeConfig));

  SwaggerModule.setup("swagger", app, getSwaggerConfig(app), {
    jsonDocumentUrl: "swagger/json",
  });

  await app.listen(port ?? 3000);
  Logger.log(`🚀 Application is running on the port ${port}`);
}
bootstrap();

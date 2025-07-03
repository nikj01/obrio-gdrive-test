import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { INestApplication, Logger } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";

async function bootstrap() {
  const app: INestApplication = await NestFactory.create(AppModule);
  const configService: ConfigService = app.get(ConfigService);
  const port: number = configService.get<number>("SERVICE_PORT", 3000);

  // app.useGlobalFilters(new HttpExceptionFilter());
  // app.useGlobalPipes(new ValidationPipe(ValidationPipeConfig));

  // SwaggerModule.setup("swagger", app, getDocumentFactory(app), {
  //   jsonDocumentUrl: "swagger/json",
  // });

  await app.listen(port ?? 3000);
  Logger.log(`🚀 Application is running on the port ${port}`);
}
bootstrap();

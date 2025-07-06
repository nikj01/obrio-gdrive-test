import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import { INestApplication } from "@nestjs/common";

export const getSwaggerConfig = (app: INestApplication) =>
  SwaggerModule.createDocument(app, SwaggerConfig);

const SwaggerConfig = new DocumentBuilder()
  .setTitle("Files service")
  .setDescription("The files service API description")
  .setVersion("1.0")
  .addTag("files")
  .build();

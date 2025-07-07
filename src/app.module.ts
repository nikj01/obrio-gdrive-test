import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { ConfigModule } from "@nestjs/config";
import { validate } from "./config/environment-variables";
import { FilesModule } from "./files/files.module";
import { JobsModule } from "./jobs/jobs.module";
import { SessionsModule } from "./sessions/sessions.module";
import { CacheModule } from "./common/cache/cache.module";
import { HealthModule } from "./health/health.module";

@Module({
  imports: [
    ConfigModule.forRoot({
      validate,
      isGlobal: true,
      envFilePath: [".env"],
    }),
    CacheModule,
    FilesModule,
    JobsModule,
    SessionsModule,
    HealthModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

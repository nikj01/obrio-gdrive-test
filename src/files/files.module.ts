import { Module } from "@nestjs/common";
import { FilesService } from "./files.service";
import { FilesController } from "./files.controller";
import { PrismaModule } from "../common/prisma/prisma.module";
import { FilesRepository } from "./files.repository";
import { StorageModule } from "../providers/storage.module";
import { FileUploadProcessor } from "./processor/files.processor";
import { SessionsModule } from "../sessions/sessions.module";
import { JobsModule } from "../jobs/jobs.module";
import { BullMqModule } from "./bull/bullmq.module";
import { FilesProcessorHelper } from "./processor/helpers/files.processor.helper";
import { CacheModule } from "../common/cache/cache.module";
import { RedisConfigModule } from "@app/config/redis/redis.config.module";

@Module({
  imports: [
    PrismaModule,
    BullMqModule,
    SessionsModule,
    JobsModule,
    StorageModule,
    CacheModule,
    RedisConfigModule,
  ],
  controllers: [FilesController],
  providers: [FilesService, FilesRepository, FileUploadProcessor, FilesProcessorHelper],
})
export class FilesModule {}

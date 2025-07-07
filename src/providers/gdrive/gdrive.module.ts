import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { CacheModule } from "../../common/cache/cache.module";
import { RedisConfigModule } from "@app/config/redis/redis.config.module";
import { GDriveService } from "./gdrive.service";
import { GDriveFolderManager } from "./helpers/gdrive.folder.manager";
import { GDriveConfigManager } from "./helpers/gdrive.config.manager";
import { getRedlockConfig, REDLOCK } from "./helpers/gdrive.redlock.config";

@Module({
  imports: [ConfigModule, CacheModule, RedisConfigModule],
  providers: [
    GDriveService,
    GDriveFolderManager,
    GDriveConfigManager,
    {
      provide: REDLOCK,
      ...getRedlockConfig(),
    },
  ],
  exports: [GDriveService, GDriveFolderManager, GDriveConfigManager],
})
export class GDriveModule {}

import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { GDriveService } from "./gdrive.service";
import { GDriveFolderManager } from "./helpers/gdrive.folder.manager";
import { GDriveConfigManager } from "./helpers/gdrive.config.manager";

@Module({
  imports: [ConfigModule],
  providers: [GDriveService, GDriveFolderManager, GDriveConfigManager],
  exports: [GDriveService, GDriveFolderManager, GDriveConfigManager],
})
export class GDriveModule {}

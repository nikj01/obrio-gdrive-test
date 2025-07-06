import { Module } from "@nestjs/common";
import { GDriveModule } from "./gdrive/gdrive.module";
import { IStorageService } from "./storage.adapter";
import { GDriveService } from "./gdrive/gdrive.service";

@Module({
  imports: [GDriveModule],
  providers: [
    {
      provide: IStorageService,
      useClass: GDriveService,
    },
  ],
  exports: [IStorageService],
})
export class StorageModule {}

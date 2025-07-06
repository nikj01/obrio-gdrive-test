import { Injectable, Logger } from "@nestjs/common";
import { google, drive_v3 } from "googleapis";
import { ConfigService } from "@nestjs/config";

@Injectable()
export class GDriveConfigManager {
  private readonly logger = new Logger(GDriveConfigManager.name);
  public readonly drive: drive_v3.Drive;
  public readonly folderMime = "application/vnd.google-apps.folder";
  public readonly mainFolderId?: string;

  constructor(private readonly configService: ConfigService) {
    const auth = new google.auth.GoogleAuth({
      scopes: ["https://www.googleapis.com/auth/drive.file"],
    });
    this.drive = google.drive({ version: "v3", auth });

    this.mainFolderId = this.configService.get<string>(
      "EXTERNAL_STORAGE_MAIN_FOLDER_ID",
      { infer: true },
    );
    if (!this.mainFolderId) {
      this.logger.warn(
        "GDrive main folder not set. Files will be created in service account root.",
      );
    }
  }
}

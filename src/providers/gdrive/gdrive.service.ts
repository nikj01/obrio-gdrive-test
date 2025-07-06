import { Injectable, Logger } from "@nestjs/common";
import {
  IStorageService,
  UploadFileToStorageData,
  UploadFileToStorageResult,
} from "../storage.adapter";
import { GDriveFolderManager } from "./helpers/gdrive.folder.manager";
import { GDriveConfigManager } from "./helpers/gdrive.config.manager";
import { drive_v3 } from "googleapis";

@Injectable()
export class GDriveService extends IStorageService {
  private readonly logger = new Logger(GDriveService.name);

  constructor(
    private readonly configManager: GDriveConfigManager,
    private readonly folderManager: GDriveFolderManager,
  ) {
    super();
  }

  async uploadFile(data: UploadFileToStorageData): Promise<UploadFileToStorageResult> {
    const { filename, stream, mimeType, folderId } = data;
    const drive = this.configManager.drive;
    const mainFolder = this.configManager.mainFolderId;
    this.logger.log(`Uploading file: ${filename}`);

    const target = folderId
      ? await this.folderManager.getOrCreateFolderSafe(folderId, mainFolder)
      : mainFolder;

    const metadata: drive_v3.Schema$File = {
      name: filename,
      parents: target ? [target] : undefined,
    };

    const response = await drive.files.create({
      requestBody: metadata,
      media: { mimeType, body: stream },
      fields: "id,name,webViewLink",
    });
    const file = response.data;
    if (!file.id || !file.webViewLink) {
      throw new Error("Missing required fields from Drive API");
    }

    await this.folderManager.makeFilePublic(file.id);

    return {
      id: file.id,
      name: file.name!,
      viewUrl: file.webViewLink,
      downloadUrl: `https://drive.google.com/uc?export=download&id=${file.id}`,
    };
  }
}

import { Injectable, Logger } from "@nestjs/common";
import { drive_v3 } from "googleapis";
import { GDriveConfigManager } from "./gdrive.config.manager";

@Injectable()
export class GDriveFolderManager {
  private readonly logger = new Logger(GDriveFolderManager.name);
  private readonly drive: drive_v3.Drive;
  private readonly FOLDER_MIME: string;
  private readonly folderCache = new Map<string, string>();
  private readonly folderCreationLocks = new Map<string, Promise<string>>();
  private readonly mainFolderId?: string;

  constructor(private readonly configManager: GDriveConfigManager) {
    this.drive = this.configManager.drive;
    this.FOLDER_MIME = this.configManager.folderMime;
    this.mainFolderId = this.configManager.mainFolderId;
  }

  async getOrCreateFolderSafe(
    folderName: string,
    parentFolderId: string = this.mainFolderId ?? "root",
  ): Promise<string> {
    const cacheKey = `${folderName}:${parentFolderId}`;

    if (this.folderCache.has(cacheKey)) {
      const id = this.folderCache.get(cacheKey)!;
      this.logger.log(`Using cached folder ID for "${folderName}" → ${id}`);
      return id;
    }

    if (this.folderCreationLocks.has(cacheKey)) {
      this.logger.log(`Waiting for lock for "${folderName}"`);
      return this.folderCreationLocks.get(cacheKey)!;
    }

    const promise = this.createOrFindFolder(folderName, parentFolderId);
    this.folderCreationLocks.set(cacheKey, promise);

    try {
      const id = await promise;
      this.folderCache.set(cacheKey, id);
      return id;
    } finally {
      this.folderCreationLocks.delete(cacheKey);
    }
  }

  private async createOrFindFolder(
    folderName: string,
    parentFolderId: string,
    maxRetries = 3,
  ): Promise<string> {
    for (let i = 1; i <= maxRetries; i++) {
      try {
        const q = [
          `name='${folderName.replace(/'/g, "\\'")}'`,
          `mimeType='${this.FOLDER_MIME}'`,
          "trashed=false",
          `'${parentFolderId}' in parents`,
        ].join(" and ");

        const list = await this.drive.files.list({
          q,
          fields: "files(id,name)",
        });

        const existing = list.data.files?.[0];
        if (existing?.id) {
          this.logger.log(`Found folder "${folderName}" → ${existing.id}`);
          return existing.id;
        }

        const created = await this.drive.files.create({
          requestBody: {
            name: folderName,
            mimeType: this.FOLDER_MIME,
            parents: [parentFolderId],
          },
          fields: "id",
        });
        const newId = created.data.id!;
        this.logger.log(`Created folder "${folderName}" → ${newId}`);

        await this.makeFilePublic(newId);
        return newId;
      } catch (err: any) {
        this.logger.warn(
          `Attempt ${i}/${maxRetries} for "${folderName}" failed: ${err.message}`,
        );
        if (i === maxRetries) throw err;
        await new Promise(r => setTimeout(r, 2 ** i * 1000));
      }
    }
    throw new Error("Unreachable");
  }

  async makeFilePublic(fileId: string): Promise<void> {
    try {
      await this.drive.permissions.create({
        fileId,
        requestBody: { role: "reader", type: "anyone" },
      });
      this.logger.log(`Made folder public: ${fileId}`);
    } catch (err: any) {
      this.logger.error(`Failed to make folder public: ${fileId}`, err.stack);
    }
  }
}

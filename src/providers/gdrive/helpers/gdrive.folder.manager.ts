import { Injectable, Logger, Inject } from "@nestjs/common";
import { drive_v3 } from "googleapis";
import { GDriveConfigManager } from "./gdrive.config.manager";
import { CACHE_MANAGER } from "@nestjs/cache-manager";
import type { Cache } from "cache-manager";
import Redlock, { Lock } from "redlock";
import { REDLOCK } from "./gdrive.redlock.config";

@Injectable()
export class GDriveFolderManager {
  private readonly logger = new Logger(GDriveFolderManager.name);
  private readonly drive: drive_v3.Drive;
  private readonly FOLDER_MIME: string;
  private readonly mainFolderId?: string;

  private readonly localCache = new Map<string, { id: string; expiry: number }>();
  private readonly LOCAL_CACHE_TTL = 30000;

  private readonly inFlightOperations = new Map<string, Promise<string>>();

  constructor(
    private readonly configManager: GDriveConfigManager,
    @Inject(CACHE_MANAGER) private readonly cacheManager: Cache,
    @Inject(REDLOCK) private readonly redlock: Redlock,
  ) {
    this.drive = this.configManager.drive;
    this.FOLDER_MIME = this.configManager.folderMime;
    this.mainFolderId = this.configManager.mainFolderId;
  }

  async getOrCreateFolderSafe(
    folderName: string,
    parentFolderId: string = this.mainFolderId ?? "root",
  ): Promise<string> {
    const cacheKey = `${folderName}:${parentFolderId}`;
    const redisKey = `gdrive:folder:${cacheKey}`;

    const localEntry = this.localCache.get(cacheKey);
    if (localEntry && localEntry.expiry > Date.now()) {
      this.logger.log(`(local) ${folderName} → ${localEntry.id}`);
      return localEntry.id;
    }

    if (this.inFlightOperations.has(cacheKey)) {
      this.logger.log(`(waiting) ${folderName}`);
      return this.inFlightOperations.get(cacheKey)!;
    }

    const operation = this.performFolderOperation(
      folderName,
      parentFolderId,
      cacheKey,
      redisKey,
    );
    this.inFlightOperations.set(cacheKey, operation);

    try {
      return await operation;
    } finally {
      this.inFlightOperations.delete(cacheKey);
    }
  }

  private async performFolderOperation(
    folderName: string,
    parentFolderId: string,
    cacheKey: string,
    redisKey: string,
  ): Promise<string> {
    const fromRedis = await this.cacheManager.get<string>(redisKey);
    if (fromRedis) {
      this.logger.log(`(redis) ${folderName} → ${fromRedis}`);
      this.setLocalCache(cacheKey, fromRedis);
      return fromRedis;
    }

    const lockKey = `lock:folder:${cacheKey}`;
    const lockTimeout = 15000;

    let lock: Lock;
    try {
      lock = await this.redlock.acquire([lockKey], lockTimeout);
      this.logger.log(`Lock acquired: ${lockKey}`);
    } catch (err) {
      this.logger.error(`Cannot acquire lock for ${folderName}`, err);
      throw new Error(`Failed to acquire lock for folder: ${folderName}`);
    }

    try {
      const retryRedis = await this.cacheManager.get<string>(redisKey);
      if (retryRedis) {
        this.logger.log(`(redis↺) ${folderName} → ${retryRedis}`);
        this.setLocalCache(cacheKey, retryRedis);
        return retryRedis;
      }

      const folderId = await this.createOrFindFolder(folderName, parentFolderId);

      await this.cacheManager.set(redisKey, folderId, 24 * 3600);
      this.setLocalCache(cacheKey, folderId);

      return folderId;
    } finally {
      await lock.release();
      this.logger.log(`Lock released: ${lockKey}`);
    }
  }

  private setLocalCache(cacheKey: string, folderId: string): void {
    this.localCache.set(cacheKey, {
      id: folderId,
      expiry: Date.now() + this.LOCAL_CACHE_TTL,
    });
  }

  private async createOrFindFolder(
    folderName: string,
    parentFolderId: string,
    maxRetries = 3,
  ): Promise<string> {
    let lastError: Error | null = null;

    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        const existingId = await this.findExistingFolder(folderName, parentFolderId);
        if (existingId) {
          this.logger.log(`Found folder "${folderName}" → ${existingId}`);
          return existingId;
        }

        const newId = await this.createNewFolder(folderName, parentFolderId);
        this.logger.log(`Created folder "${folderName}" → ${newId}`);
        return newId;
      } catch (err: any) {
        lastError = err;
        this.logger.warn(
          `Attempt ${attempt}/${maxRetries} for "${folderName}" failed: ${err.message}`,
        );

        if (attempt === maxRetries) break;

        const delay = Math.min(2 ** attempt * 1000, 8000);
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }

    throw (
      lastError || new Error(`Failed to create/find folder after ${maxRetries} attempts`)
    );
  }

  private async findExistingFolder(
    folderName: string,
    parentFolderId: string,
  ): Promise<string | null> {
    const query = [
      `name='${folderName.replace(/'/g, "\\'")}'`,
      `mimeType='${this.FOLDER_MIME}'`,
      "trashed=false",
      `'${parentFolderId}' in parents`,
    ].join(" and ");

    const response = await this.drive.files.list({
      q: query,
      fields: "files(id,name)",
      pageSize: 1,
    });

    return response.data.files?.[0]?.id || null;
  }

  private async createNewFolder(
    folderName: string,
    parentFolderId: string,
  ): Promise<string> {
    const response = await this.drive.files.create({
      requestBody: {
        name: folderName,
        mimeType: this.FOLDER_MIME,
        parents: [parentFolderId],
      },
      fields: "id",
    });

    const newId = response.data.id!;

    this.makeFilePublic(newId).catch(err => {
      this.logger.error(`Failed to make folder public: ${newId}`, err);
    });

    return newId;
  }

  async makeFilePublic(fileId: string): Promise<void> {
    try {
      await this.drive.permissions.create({
        fileId,
        requestBody: { role: "reader", type: "anyone" },
      });
      this.logger.log(`Made file public: ${fileId}`);
    } catch (err: any) {
      this.logger.error(`Failed to make file public: ${fileId}`, err.stack);
    }
  }

  private cleanupLocalCache(): void {
    const now = Date.now();
    for (const [key, entry] of this.localCache.entries()) {
      if (entry.expiry <= now) {
        this.localCache.delete(key);
      }
    }
  }

  public performMaintenance(): void {
    this.cleanupLocalCache();
    this.logger.log(`Local cache cleanup completed. Size: ${this.localCache.size}`);
  }
}

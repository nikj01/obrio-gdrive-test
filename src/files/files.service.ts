import { Inject, Injectable, Logger, UseInterceptors } from "@nestjs/common";
import { UploadFilesRequestDto } from "./dtos/upload-files/upload-files-request.dto";
import {
  SessionsRepository,
  UploadSessionWithFiles,
} from "../sessions/sessions.repository";
import { InjectQueue } from "@nestjs/bullmq";
import { UPLOAD_FILES_JOB, UPLOAD_FILES_QUEUE } from "./bull/constants";
import { Queue } from "bullmq";
import { File } from "@prisma/client";
import { BullUploadFileJob } from "./processor/files.processor.interfaces";
import { GetFilesRequestDto } from "./dtos/get-files/get-files-request.dto";
import { FilesRepository } from "./files.repository";
import { GetFilesResponseDto } from "./dtos/get-files/get-files-response.dto";
import { CACHE_MANAGER, CacheInterceptor } from "@nestjs/cache-manager";
import { RedisConfigService } from "@app/config/redis/redis.config.service";
import { Cache } from "cache-manager";

@Injectable()
@UseInterceptors(CacheInterceptor)
export class FilesService {
  private readonly logger = new Logger(FilesService.name);

  constructor(
    @InjectQueue(UPLOAD_FILES_QUEUE)
    private readonly uploadFilesQueue: Queue,
    @Inject(CACHE_MANAGER)
    private readonly cacheManager: Cache,
    private readonly sessionsRepository: SessionsRepository,
    private readonly filesRepository: FilesRepository,
    private readonly redisConfigService: RedisConfigService,
  ) {}

  async uploadFilesToStorage(dto: UploadFilesRequestDto) {
    const session: UploadSessionWithFiles =
      await this.sessionsRepository.createSessionWithFiles(dto);

    const jobs = this.mapFilesUrlsToJobs(UPLOAD_FILES_JOB, session.files);

    try {
      this.logger.log(
        `Adding ${jobs.length} jobs to the queue for session ${session.id}`,
      );
      await this.uploadFilesQueue.addBulk(jobs);
    } catch (error) {
      this.logger.error("Failed to add jobs to the queue", error.message);
      throw new Error("Failed to create upload session");
    }
  }

  private mapFilesUrlsToJobs(jobName: string, files: File[]): BullUploadFileJob[] {
    return files.map((file: File) => ({
      name: jobName,
      data: {
        url: file.originalUrl,
        fileId: file.id,
        fileOwnerId: file.ownerId,
        uploadSessionId: file.uploadSessionId,
      },
    }));
  }

  async getFilesByUser(dto: GetFilesRequestDto): Promise<GetFilesResponseDto> {
    const { ownerId, limit, page } = dto;

    this.logger.log(`Checking cache for files of user with ID: ${ownerId}`);
    const cacheKey = `files:${ownerId}:${page}:${limit}`;
    const cachedFiles = await this.cacheManager.get<GetFilesResponseDto>(cacheKey);

    if (cachedFiles) {
      this.logger.log(`Cache hit for user ID: ${ownerId}`);
      return cachedFiles;
    } else {
      this.logger.log(`Fetching files for user with ID: ${ownerId}`);
      const fetchedFiles = await this.filesRepository.getFilesByUser(dto);

      this.logger.log(`Caching files for user ID: ${ownerId}`);
      await this.cacheManager.set(
        cacheKey,
        fetchedFiles,
        this.redisConfigService.getTTLWithJitter,
      );
      this.logger.log(`Files cached for user ID: ${ownerId}`);
      return fetchedFiles;
    }
  }
}

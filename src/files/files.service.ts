import { Injectable, Logger } from "@nestjs/common";
import { UploadFilesDto } from "./dto/upload-files.dto";
import {
  SessionsRepository,
  UploadSessionWithFiles,
} from "../sessions/sessions.repository";
import { InjectQueue } from "@nestjs/bullmq";
import { UPLOAD_FILES_JOB, UPLOAD_FILES_QUEUE } from "./bull/constants";
import { Queue } from "bullmq";
import { File } from "@prisma/client";
import { BullUploadFileJob } from "./processor/files.processor.interfaces";

@Injectable()
export class FilesService {
  private readonly logger = new Logger(FilesService.name);

  constructor(
    @InjectQueue(UPLOAD_FILES_QUEUE)
    private readonly uploadFilesQueue: Queue,
    private readonly sessionsRepository: SessionsRepository,
  ) {}

  async uploadFilesToStorage(dto: UploadFilesDto) {
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
}

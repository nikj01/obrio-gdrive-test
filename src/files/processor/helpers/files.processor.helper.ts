import { Injectable, Logger } from "@nestjs/common";
import { Readable } from "stream";
import type { ReadableStream as WebReadableStream } from "stream/web";
import {
  FailedFileUploadData,
  SuccessfulFileUploadData,
  TransferFileMetadata,
} from "../files.processor.interfaces";
import { PrismaService } from "../../../common/prisma/prisma.service";
import { FilesRepository } from "../../files.repository";
import { JobsRepository } from "../../../jobs/jobs.repository";
import { SessionsRepository } from "../../../sessions/sessions.repository";

@Injectable()
export class FilesProcessorHelper {
  private readonly logger = new Logger(FilesProcessorHelper.name);

  constructor(
    private readonly prismaService: PrismaService,
    private readonly filesRepository: FilesRepository,
    private readonly jobsRepository: JobsRepository,
    private readonly sessionsRepository: SessionsRepository,
  ) {}

  async extractFileDownloadMetadata(url: string): Promise<TransferFileMetadata> {
    this.logger.log(`Fetching file for metadata: ${url}`);

    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Failed to download file. HTTP ${response.status}`);
    }
    if (!response.body) {
      throw new Error("Response has no body to stream");
    }

    const webStream = response.body as unknown as WebReadableStream<Uint8Array>;
    const nodeStream = Readable.fromWeb(webStream);
    const mimeType = response.headers.get("content-type") ?? undefined;
    const sizeHeader = response.headers.get("content-length");
    const size = sizeHeader ? Number(sizeHeader) : undefined;
    const pathname = new URL(url).pathname;
    const filename = pathname.split("/").pop() || `file_${Date.now()}`;

    this.logger.log(
      `Extracted metadata — filename="${filename}", mimeType=${mimeType}, size=${size}`,
    );

    return { nodeStream, filename, mimeType, size };
  }

  async confirmSuccessfulFileUpload(data: SuccessfulFileUploadData): Promise<void> {
    this.logger.log(`Confirming successful file upload for file ID: ${data.fileId}`);
    const {
      fileId,
      originalFilename,
      storageFileId,
      storageDownloadUrl,
      storageViewUrl,
      fileSize,
      mimeType,
      hash,
      jobRecordId,
      uploadSessionId,
    } = data;

    await this.prismaService.$transaction(async tx => [
      await this.filesRepository.completeFileUpload({
        transaction: tx,
        id: fileId,
        originalFilename,
        storageFileId,
        storageDownloadUrl,
        storageViewUrl,
        fileSize,
        mimeType,
        hash,
      }),
      this.logger.log(`File upload completed for file ID: ${fileId}`),

      await this.jobsRepository.setJobRecordStatusCompleted({
        transaction: tx,
        id: jobRecordId,
      }),
      this.logger.log(`Job record status set to COMPLETED for Job ID: ${jobRecordId}`),

      await this.sessionsRepository.increaseCompletedFilesCount({
        transaction: tx,
        id: uploadSessionId,
      }),
      this.logger.log(
        `Completed files count increased for session ID: ${uploadSessionId}`,
      ),
    ]);
  }

  async confirmFailedFileUpload(data: FailedFileUploadData): Promise<void> {
    this.logger.error(`Confirming failed file upload for file ID: ${data.fileId}`);
    const { fileId, errorMessage, jobRecordId, uploadSessionId } = data;

    await this.prismaService.$transaction(async tx => [
      await this.jobsRepository.setJobRecordStatusFailed({
        transaction: tx,
        id: jobRecordId,
      }),
      this.logger.error(`Job record status set to FAILED for Job ID: ${jobRecordId}`),

      await this.filesRepository.setFileStatusToFailed({
        transaction: tx,
        id: fileId,
        errorMessage,
      }),
      this.logger.error(`File status set to FAILED for file ID: ${fileId}`),

      await this.sessionsRepository.increaseFailedFilesCount({
        transaction: tx,
        id: uploadSessionId,
      }),
      this.logger.error(
        `Failed files count increased for session ID: ${uploadSessionId}`,
      ),
    ]);
  }
}

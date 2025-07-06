import { Processor } from "@nestjs/bullmq";
import { Job } from "bullmq";
import { HashStream } from "./helpers/files.hashstream";
import { BullMqProcessor } from "../bull/bullmq.processor";
import { IStorageService } from "../../providers/storage.adapter";
import { JobsRepository } from "../../jobs/jobs.repository";
import { JobRecord } from "@prisma/client";
import { getProcessorSettings } from "./helpers/files.processor.config";
import { UploadFileJobData } from "./files.processor.interfaces";
import { FilesProcessorHelper } from "./helpers/files.processor.helper";
import { UPLOAD_FILES_QUEUE } from "../bull/constants";

@Processor(UPLOAD_FILES_QUEUE, getProcessorSettings())
export class FileUploadProcessor extends BullMqProcessor {
  constructor(
    private readonly storage: IStorageService,
    private readonly processorHelper: FilesProcessorHelper,
    private readonly jobsRepository: JobsRepository,
  ) {
    super();
  }

  async process(job: Job<UploadFileJobData>): Promise<void> {
    const { url, fileId, fileOwnerId, uploadSessionId } = job.data;
    let jobRecord: JobRecord | null = null;

    this.logger.log(`Starting file transfer: ${url}`);

    try {
      jobRecord = await this.jobsRepository.createJobRecord({
        fileId,
        jobId: Number(job.id),
      });

      const { nodeStream, filename, mimeType, size } =
        await this.processorHelper.extractFileDownloadMetadata(url);

      const hashStream = new HashStream();
      const hashPromise = new Promise<string>((resolve, reject) => {
        hashStream.once("finish", () => resolve(hashStream.digest));
        hashStream.once("error", reject);
      });

      const uploadPromise = this.storage.uploadFile({
        filename,
        stream: nodeStream.pipe(hashStream),
        mimeType,
        folderId: fileOwnerId,
      });

      const [hash, uploadResult] = await Promise.all([hashPromise, uploadPromise]);

      this.logger.log(
        `File uploaded → ID=${uploadResult.id}, viewUrl=${uploadResult.viewUrl}, SHA256=${hash}`,
      );

      await this.processorHelper.confirmSuccessfulFileUpload({
        fileId,
        originalFilename: filename,
        storageFileId: uploadResult.id,
        storageDownloadUrl: uploadResult.downloadUrl!,
        storageViewUrl: uploadResult.viewUrl,
        fileSize: size,
        mimeType,
        hash,
        jobRecordId: jobRecord.id,
        uploadSessionId,
      });
    } catch (error) {
      this.logger.error(`Error processing file ${url}: ${error.message}`, error.stack);
      if (jobRecord) {
        await this.processorHelper.confirmFailedFileUpload({
          jobRecordId: jobRecord.id,
          fileId,
          uploadSessionId,
          errorMessage: error instanceof Error ? error.message : String(error),
        });
      }
      throw error;
    }
  }
}

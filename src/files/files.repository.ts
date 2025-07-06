import { Injectable, Logger } from "@nestjs/common";
import { PrismaService } from "../common/prisma/prisma.service";
import { PrismaErrorHandler } from "../common/prisma/prisma.error-handler";
import { File, FileStatus } from "@prisma/client";
import { UpdateFileMetadataDto } from "./dto/update-file-metadata.dto";
import { FileUploadFailedDto } from "./dto/file-upload-failed.dto";

@Injectable()
export class FilesRepository {
  private readonly logger = new Logger(FilesRepository.name);

  constructor() {}

  @PrismaErrorHandler()
  async completeFileUpload(dto: UpdateFileMetadataDto): Promise<File> {
    const {
      transaction,
      id,
      originalFilename,
      storageFileId,
      storageViewUrl,
      storageDownloadUrl,
      fileSize,
      mimeType,
      hash,
    } = dto;
    this.logger.log(`Updating file metadata for ID: ${id}`);

    const updatedFile: File = await transaction.file.update({
      where: { id },
      data: {
        originalFilename,
        storageFileId,
        storageViewUrl,
        storageDownloadUrl,
        fileSize,
        mimeType,
        hash,
        status: FileStatus.COMPLETED,
        updatedAt: new Date(),
      },
    });

    this.logger.log(`File with ID: ${id} updated successfully`);
    return updatedFile;
  }

  @PrismaErrorHandler()
  async setFileStatusToFailed(dto: FileUploadFailedDto): Promise<File> {
    const { transaction, id, errorMessage } = dto;
    this.logger.error(`Setting file status to FAILED for ID: ${id}`);

    const updatedFile: File = await transaction.file.update({
      where: { id },
      data: {
        errorMessage,
        status: FileStatus.FAILED,
        updatedAt: new Date(),
      },
    });

    this.logger.error(`File with ID: ${id} status set to FAILED`);
    return updatedFile;
  }
}

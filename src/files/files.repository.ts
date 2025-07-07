import { Injectable, Logger } from "@nestjs/common";
import { PrismaService } from "../common/prisma/prisma.service";
import { PrismaErrorHandler } from "../common/prisma/prisma.error-handler";
import { File, FileStatus } from "@prisma/client";
import { UpdateFileMetadataDto } from "./dtos/upload-files/update-file-metadata.dto";
import { FileUploadFailedDto } from "./dtos/upload-files/file-upload-failed.dto";
import { GetFilesRequestDto } from "./dtos/get-files/get-files-request.dto";
import { extension } from "prisma-paginate";
import { GetFilesResponseDto } from "./dtos/get-files/get-files-response.dto";
import { plainToInstance } from "class-transformer";
import { FileResponseDto } from "./dtos/get-files/get-file-response.dto";
import { PaginationResponseDto } from "./dtos/get-files/pagination-response.dto";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";

@Injectable()
export class FilesRepository {
  private readonly logger = new Logger(FilesRepository.name);
  private readonly extendedPrisma: ReturnType<typeof this.prismaService.$extends>;

  constructor(private readonly prismaService: PrismaService) {
    this.extendedPrisma = this.prismaService.$extends(extension);
  }

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

  @PrismaErrorHandler()
  async getFilesByUser(dto: GetFilesRequestDto): Promise<GetFilesResponseDto> {
    const { ownerId, page, limit } = dto;
    this.logger.log(
      `Fetching files for user with ID: ${ownerId}, page: ${page}, limit: ${limit}`,
    );

    const result = await (this.extendedPrisma.file as any).paginate(
      {
        where: {
          ownerId,
        },
        orderBy: {
          createdAt: "desc",
        },
      },
      {
        page,
        limit,
      },
    );

    if (result.result.length === 0) {
      this.logger.error(`No files found for user with ID: ${ownerId}`);
      throw new PrismaClientKnownRequestError(
        `No files found for user with ID: ${ownerId}. Check if the user exists or has uploaded files.`,
        {
          code: "P2025",
          clientVersion: "6.11.1",
          meta: { target: `User ${ownerId}` },
        },
      );
    }

    this.logger.log(`Fetched ${result.result.length} files for user with ID: ${ownerId}`);

    const files = result.result.map((file: File) =>
      plainToInstance(FileResponseDto, file, { excludeExtraneousValues: true }),
    );

    const pagination = plainToInstance(PaginationResponseDto, result, {
      excludeExtraneousValues: true,
    });

    return { files, pagination };
  }
}

import { Injectable, Logger } from "@nestjs/common";
import { PrismaService } from "../common/prisma/prisma.service";
import { PrismaErrorHandler } from "../common/prisma/prisma.error-handler";
import { Prisma, UploadSession } from "@prisma/client";
import { UploadFilesRequestDto } from "../files/dtos/upload-files/upload-files-request.dto";
import { UpdateSessionDto } from "./dtos/update-session.dto";

export type UploadSessionWithFiles = Prisma.UploadSessionGetPayload<{
  include: { files: true };
}>;

@Injectable()
export class SessionsRepository {
  private readonly logger = new Logger(SessionsRepository.name);

  constructor(private readonly prismaService: PrismaService) {}

  @PrismaErrorHandler()
  async createSessionWithFiles(
    dto: UploadFilesRequestDto,
  ): Promise<UploadSessionWithFiles> {
    const { ownerId, fileUrls } = dto;
    this.logger.log(`Creating session for user ${ownerId} with ${fileUrls.length} files`);

    const session = await this.prismaService.uploadSession.create({
      data: {
        totalFiles: fileUrls.length,
        files: {
          create: fileUrls.map(url => ({
            ownerId,
            originalUrl: url,
          })),
        },
      },
      include: {
        files: true,
      },
    });

    this.logger.log(`Session ${session.id} created with ${session.files.length} files`);
    return session;
  }

  @PrismaErrorHandler()
  async getSessionById(id: string): Promise<UploadSession> {
    this.logger.log(`Fetching session with ID: ${id}`);
    const session: UploadSession | null =
      await this.prismaService.uploadSession.findUnique({
        where: { id },
      });

    if (!session) {
      this.logger.warn(`Session with ID: ${id} not found`);
      throw new Error(`Session with ID: ${id} not found`);
    }

    this.logger.log(`Session with ID: ${id} fetched successfully`);
    return session;
  }

  @PrismaErrorHandler()
  async increaseCompletedFilesCount(dto: UpdateSessionDto): Promise<UploadSession> {
    const { transaction, id } = dto;
    this.logger.log(`Increasing completed files count for session ID: ${id}`);

    const updatedSession: UploadSession = await transaction.uploadSession.update({
      where: { id },
      data: { completedFiles: { increment: 1 }, updatedAt: new Date() },
    });

    this.logger.log("Completed files count increased successfully");
    return updatedSession;
  }

  @PrismaErrorHandler()
  async increaseFailedFilesCount(dto: UpdateSessionDto): Promise<UploadSession> {
    const { transaction, id } = dto;
    this.logger.log(`Increasing failed files count for session ID: ${id}`);

    const updatedSession: UploadSession = await transaction.uploadSession.update({
      where: { id },
      data: { failedFiles: { increment: 1 }, updatedAt: new Date() },
    });

    this.logger.log("Failed files count increased successfully");
    return updatedSession;
  }
}

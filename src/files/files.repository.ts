import { Injectable, Logger } from "@nestjs/common";
import { PrismaService } from "../common/prisma/prisma.service";

@Injectable()
export class FilesRepository {
  private readonly logger = new Logger(FilesRepository.name);

  constructor(private readonly prismaService: PrismaService) {}

  // saveFiles(files: string[], ownerId: string): undefined {
  //   this.logger.log(`Saving files for user ${userId}: ${files.join(", ")}`);
  //
  //   try {
  //     await this.prismaService.file.createMany({
  //       data: {
  //         ownerId: ownerId,
  //         name: name,
  //         path: path,
  //         type: type,
  //       },
  //     });
  //     this.logger.log(`Files saved successfully for user ${userId}`);
  //   } catch (error) {
  //     this.logger.error(`Failed to save files for user ${userId}`, error);
  //     throw error;
  //   }
  // }
}

import { Module } from "@nestjs/common";
import { FilesService } from "./files.service";
import { FilesController } from "./files.controller";
import { PrismaModule } from "../common/prisma/prisma.module";
import { FilesRepository } from "./files.repository";

@Module({
  imports: [PrismaModule],
  controllers: [FilesController],
  providers: [FilesService, FilesRepository],
})
export class FilesModule {}

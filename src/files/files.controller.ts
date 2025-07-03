import { Controller, Post, Body, Logger } from "@nestjs/common";
import { FilesService } from "./files.service";
import { UploadFilesDto } from "./dto/upload-files.dto";

@Controller("files")
export class FilesController {
  private readonly logger = new Logger(FilesController.name);

  constructor(private readonly filesService: FilesService) {}

  @Post()
  uploadFiles(@Body() uploadFilesDto: UploadFilesDto) {
    this.logger.log("Received an incoming request");
    return this.filesService.uploadFilesToStorage(uploadFilesDto);
  }
}

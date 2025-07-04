import { Controller, Post, Body, Logger } from "@nestjs/common";
import { FilesService } from "./files.service";
import { UploadFilesDto } from "./dto/upload-files.dto";
import { ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import { UploadFilesResponses } from "./files.swagger";

@ApiTags("Files")
@Controller("files")
export class FilesController {
  private readonly logger = new Logger(FilesController.name);

  constructor(private readonly filesService: FilesService) {}

  @ApiOperation({ summary: "Upload files to storage" })
  @ApiResponse(UploadFilesResponses.response201)
  @ApiResponse(UploadFilesResponses.response400)
  @ApiResponse(UploadFilesResponses.response500)
  @Post()
  uploadFiles(@Body() dto: UploadFilesDto) {
    this.logger.log("Received an incoming request");
    return this.filesService.uploadFilesToStorage(dto);
  }
}

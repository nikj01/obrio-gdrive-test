import { Controller, Post, Body, Logger, Get, Param, Query } from "@nestjs/common";
import { FilesService } from "./files.service";
import { UploadFilesRequestDto } from "./dtos/upload-files/upload-files-request.dto";
import { ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import { GetFilesByUserResponses, UploadFilesResponses } from "./files.swagger";
import { GetFilesRequestDto } from "./dtos/get-files/get-files-request.dto";
import { GetFilesResponseDto } from "./dtos/get-files/get-files-response.dto";

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
  async uploadFiles(@Body() dto: UploadFilesRequestDto): Promise<void> {
    this.logger.log("Received an incoming request");
    return await this.filesService.uploadFilesToStorage(dto);
  }

  @ApiOperation({ summary: "Get files by user ID" })
  @ApiResponse(GetFilesByUserResponses.response200)
  @ApiResponse(GetFilesByUserResponses.response404)
  @ApiResponse(GetFilesByUserResponses.response500)
  @Get(":ownerId")
  async getFilesByUser(
    @Param("ownerId") ownerId: string,
    @Query("page") page: number,
    @Query("limit") limit: number,
  ): Promise<GetFilesResponseDto> {
    this.logger.log(`Fetching files for user with ID: ${ownerId}`);
    return await this.filesService.getFilesByUser({ ownerId, page, limit });
  }
}

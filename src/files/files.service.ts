import { Injectable } from "@nestjs/common";
import { UploadFilesDto } from "./dto/upload-files.dto";

@Injectable()
export class FilesService {
  uploadFilesToStorage(uploadFilesDto: UploadFilesDto) {
    return "This action adds a new file";
  }
}

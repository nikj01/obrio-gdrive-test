import { ApiProperty } from "@nestjs/swagger";
import { FileResponseDto } from "./get-file-response.dto";
import { PaginationResponseDto } from "./pagination-response.dto";
import { Expose } from "class-transformer";

export class GetFilesResponseDto {
  @ApiProperty({
    description: "Array of files",
    type: [FileResponseDto],
  })
  @Expose()
  files: FileResponseDto[];

  @ApiProperty({
    description: "Pagination metadata",
    type: PaginationResponseDto,
  })
  @Expose()
  pagination: PaginationResponseDto;
}

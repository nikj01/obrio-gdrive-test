import { ApiProperty } from "@nestjs/swagger";
import { Expose } from "class-transformer";

export class PaginationResponseDto {
  @ApiProperty({
    description: "Current page number",
    example: 1,
  })
  @Expose()
  page: number;

  @ApiProperty({
    description: "Number of items per page",
    example: 2,
  })
  @Expose()
  limit: number;

  @ApiProperty({
    description: "Total number of files",
    example: 6,
  })
  @Expose()
  count: number;

  @ApiProperty({
    description: "Total number of pages",
    example: 3,
  })
  @Expose()
  totalPages: number;

  @ApiProperty({
    description: "Whether there is a next page",
    example: true,
  })
  @Expose()
  hasNextPage: boolean;

  @ApiProperty({
    description: "Whether there is a previous page",
    example: false,
  })
  @Expose()
  hasPrevPage: boolean;

  @ApiProperty({
    description: "Whether the count exceeds the limit",
    example: false,
  })
  @Expose()
  exceedCount: boolean;

  @ApiProperty({
    description: "Whether the total pages exceed the limit",
    example: false,
  })
  @Expose()
  exceedTotalPages: boolean;
}

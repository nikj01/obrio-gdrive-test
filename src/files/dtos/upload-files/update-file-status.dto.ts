import { IsEnum, IsNotEmpty, IsOptional, IsString, MinLength } from "class-validator";
import { FileStatus } from "@prisma/client";

export class UpdateFileStatusDto {
  @IsNotEmpty({ message: "File ID is required." })
  @IsString({ message: "File ID must be a string." })
  id: string;

  @IsNotEmpty({ message: "File status is required." })
  @IsEnum(FileStatus, { message: "File status must be a valid enum value." })
  status: FileStatus;

  @IsOptional({ message: "Error message is optional." })
  @IsString({ message: "Error message must be a string." })
  @MinLength(1, { message: "Error message must be at least 1 character long." })
  errorMessage?: string;
}

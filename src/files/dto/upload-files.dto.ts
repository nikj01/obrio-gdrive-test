import {
  ArrayMaxSize,
  ArrayMinSize,
  IsArray,
  IsNotEmpty,
  IsString,
  IsUrl,
} from "class-validator";

export class UploadFilesDto {
  @IsNotEmpty({ message: "Owner ID is required." })
  @IsString({ message: "Owner ID must be a string." })
  ownerId: string;

  @IsNotEmpty({ message: "Files are required." })
  @IsArray({ message: "Files must be an array." })
  @ArrayMinSize(1, { message: "At least one file is required." })
  @ArrayMaxSize(100, { message: "A maximum of 100 files can be uploaded." })
  @IsUrl({}, { each: true })
  files: string[];
}

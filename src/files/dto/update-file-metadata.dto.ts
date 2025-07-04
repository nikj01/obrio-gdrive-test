import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsUrl,
  Min,
  MinLength,
} from "class-validator";
import { Prisma } from "@prisma/client";

export class UpdateFileMetadataDto {
  transaction: Prisma.TransactionClient;
  @IsNotEmpty({ message: "File ID is required." })
  @IsString({ message: "File ID must be a string." })
  id: string;

  @IsOptional({ message: "File name is optional." })
  @IsString({ message: "Original filename must be a string." })
  @MinLength(1, { message: "Original filename must be at least 1 character long." })
  originalFilename?: string;

  @IsOptional({ message: "Storage ID is optional." })
  @IsString({ message: "Storage ID must be a string." })
  storageFileId?: string;

  @IsOptional({ message: "Storage view URL is optional." })
  @IsUrl({}, { message: "Storage view URL must be a valid URL." })
  storageViewUrl?: string;

  @IsOptional({ message: "Storage download URL is optional." })
  @IsUrl({}, { message: "Storage download URL must be a valid URL." })
  storageDownloadUrl?: string;

  @IsOptional({ message: "File size is optional." })
  @IsNumber(
    { allowNaN: false, allowInfinity: false },
    { message: "File size must be a number." },
  )
  @Min(0, { message: "File size must be a non-negative number." })
  fileSize?: number;

  @IsOptional({ message: "File mime type is optional." })
  @IsString({ message: "File mime type must be a string." })
  mimeType?: string;

  @IsNotEmpty({ message: "File hash is required." })
  @IsString({ message: "File hash must be a string." })
  hash?: string;
}

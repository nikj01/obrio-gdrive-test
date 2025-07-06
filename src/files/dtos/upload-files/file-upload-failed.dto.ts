import { Prisma } from "@prisma/client";
import { IsNotEmpty, IsString } from "class-validator";

export class FileUploadFailedDto {
  transaction: Prisma.TransactionClient;

  @IsNotEmpty({ message: "File ID is required." })
  @IsString({ message: "File ID must be a string." })
  id: string;

  @IsNotEmpty({ message: "Error message is required." })
  @IsString({ message: "Error message must be a string." })
  errorMessage: string;
}

import { IsNotEmpty, IsString } from "class-validator";
import { Prisma } from "@prisma/client";

export class UpdateJobDto {
  transaction: Prisma.TransactionClient;

  @IsNotEmpty({ message: "Job record ID is required." })
  @IsString({ message: "Job record ID must be a string." })
  id: string;
}

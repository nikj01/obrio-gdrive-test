import { IsNotEmpty, IsString } from "class-validator";
import { Prisma } from "@prisma/client";

export class UpdateSessionDto {
  transaction: Prisma.TransactionClient;

  @IsNotEmpty({ message: "Session ID is required." })
  @IsString({ message: "Session ID must be a string." })
  id: string;
}

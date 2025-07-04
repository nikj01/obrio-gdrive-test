import { IsNotEmpty, IsNumber, IsOptional, IsPositive, IsString } from "class-validator";

export class SetJobIdDto {
  @IsNotEmpty({ message: "Job record ID is required." })
  @IsString({ message: "Job record ID must be a string." })
  id: string;

  @IsOptional({ message: "Job ID is optional." })
  @IsNumber(
    { allowNaN: false, allowInfinity: false },
    { message: "Bull job ID must be a number." },
  )
  @IsPositive({ message: "Bull job ID must be a positive number." })
  jobId?: number;
}

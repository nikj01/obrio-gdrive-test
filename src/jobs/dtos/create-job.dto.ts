import { IsNotEmpty, IsNumber, IsString } from "class-validator";

export class CreateJobDto {
  @IsNotEmpty({ message: "File ID is required." })
  @IsString({ message: "File ID must be a string." })
  fileId: string;

  @IsNotEmpty({ message: "Job ID is required." })
  @IsNumber(
    { allowNaN: false, allowInfinity: false },
    { message: "Job ID must be a number." },
  )
  jobId: number;
}

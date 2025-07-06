import { IsArray, IsNotEmpty, IsNumber, IsString, Max, Min } from "class-validator";

export class CreateSessionDto {
  @IsNotEmpty({message: "Total files count is required."})
  @IsNumber(
    { allowNaN: false, allowInfinity: false },
    { message: "Total files count must be a number." },
  )
  @Min(1, { message: "Total files count must be at least 1." })
  @Max(100, { message: "Total files count must not exceed 100." })
  totalFiles: number;

  @IsNotEmpty({message: "Files list is required."})
  @IsArray({ message: "Files must be an array of strings." })
  @IsString({ each: true, message: "Each file must be a string." })
  files: string[];
}

import { IsNotEmpty, IsNumber, IsOptional, IsString, Min } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class GetFilesRequestDto {
  @ApiProperty({
    description: "Owner ID",
    nullable: false,
    required: true,
    type: "string",
    example: "user-0197df48-8629-78f2-a240",
    minLength: 1,
    maxLength: 255,
  })
  @IsNotEmpty({ message: "Owner ID is required." })
  @IsString({ message: "Owner ID must be a string." })
  ownerId: string;

  @ApiProperty({
    description: "Page number for pagination",
    nullable: true,
    required: false,
    type: "number",
    example: 1,
    minimum: 1,
  })
  @IsOptional({ message: "Page is optional but must be a positive integer." })
  @IsNumber(
    { allowNaN: false, allowInfinity: false },
    { message: "SERVICE_PORT value must be a number" },
  )
  @Min(1, { message: "Page number must be at least 1." })
  page?: number;

  @ApiProperty({
    description: "Limit of items per page",
    nullable: true,
    required: false,
    type: "number",
    example: 10,
    minimum: 1,
  })
  @IsOptional({ message: "Limit is optional but must be a positive integer." })
  @IsNumber(
    { allowNaN: false, allowInfinity: false },
    { message: "SERVICE_PORT value must be a number" },
  )
  @Min(1, { message: "Limit must be at least 1." })
  limit?: number = 10;
}

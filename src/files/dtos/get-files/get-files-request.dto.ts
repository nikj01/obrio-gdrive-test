import { IsNotEmpty, IsNumber, IsOptional, IsPositive, IsString } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";
import { Expose, Type } from "class-transformer";

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
  @IsOptional({ message: "Owner ID is required." })
  @IsString({ message: "Owner ID must be a string." })
  @Expose()
  ownerId: string;

  @ApiProperty({
    description: "Page number for pagination",
    nullable: true,
    required: false,
    type: "number",
    example: 1,
    minimum: 1,
  })
  @IsOptional({
    message: "Page is optional, but if provided, must be a positive number.",
  })
  @Type(() => Number)
  @IsNumber({}, { message: "Page must be a number" })
  @IsPositive({ message: "Page must be > 0" })
  page?: number;

  @ApiProperty({
    description: "Limit of items per page",
    nullable: true,
    required: false,
    type: "number",
    example: 10,
    minimum: 1,
  })
  @IsOptional({
    message: "Limit is optional, but if provided, must be a positive number.",
  })
  @Type(() => Number)
  @IsNumber({}, { message: "Limit must be a number" })
  @IsPositive({ message: "Limit must be > 0" })
  limit?: number = 10;
}

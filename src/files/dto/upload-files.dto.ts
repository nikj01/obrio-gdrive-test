import {
  ArrayNotEmpty,
  IsArray,
  IsNotEmpty,
  IsUrl,
  MinLength,
  IsString,
} from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class UploadFilesDto {
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
    description: "Array of file URLs",
    nullable: false,
    required: true,
    type: "array",
    items: {
      type: "string",
      format: "uri",
    },
    example: [
      "https://napoleoncat.com/wp-content/uploads/2022/05/social-media-memes-emotional-damage-meme.jpg",
      "https://drive.google.com/uc?export=download&id=1lWff3VQxbBLaTCLfeCW6DSe5xB7prXBi",
      "https://download.virtualbox.org/virtualbox/7.1.10/VirtualBox-7.1-7.1.10_169112_fedora36-1.x86_64.rpm",
    ],
    minItems: 1,
    maxItems: 100,
  })
  @ArrayNotEmpty({ message: "At least one file URL is required." })
  @IsArray({ message: "fileUrls must be an array." })
  @MinLength(1, {
    each: true,
    message: "Each file URL must not be an empty string.",
  })
  @IsUrl({}, { each: true, message: "Each file URL must be a valid URL." })
  fileUrls: string[];
}

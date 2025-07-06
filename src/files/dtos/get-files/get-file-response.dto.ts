import { ApiProperty } from "@nestjs/swagger";
import { Expose } from "class-transformer";

export class FileResponseDto {
  @ApiProperty({
    description: "Unique identifier of the file",
    example: "0197e14f-c92e-7bb1-95ca-f0f35d3d203b",
  })
  @Expose()
  id: string;

  @ApiProperty({
    description: "Original URL of the file",
    example:
      "https://napoleoncat.com/wp-content/uploads/2022/05/social-media-memes-emotional-damage-meme.jpg",
  })
  @Expose()
  originalUrl: string;

  @ApiProperty({
    description: "Original filename of the file",
    example: "social-media-memes-emotional-damage-meme.jpg",
  })
  @Expose()
  originalFilename: string;

  @ApiProperty({
    description: "Storage view URL (Google Drive view link)",
    example:
      "https://drive.google.com/file/d/1Vn0ed1fa69DVzY1PgpKz-ufbQX42Dj8A/view?usp=drivesdk",
  })
  @Expose()
  storageViewUrl: string;

  @ApiProperty({
    description: "Storage download URL (Google Drive download link)",
    example:
      "https://drive.google.com/uc?export=download&id=1Vn0ed1fa69DVzY1PgpKz-ufbQX42Dj8A",
  })
  @Expose()
  storageDownloadUrl: string;
}

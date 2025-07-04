import {
  IsNotEmpty,
  IsNumber,
  IsString,
  Max,
  Min,
  MinLength,
  validateSync,
} from "class-validator";
import { plainToInstance } from "class-transformer";

export class EnvironmentVariables {
  @IsNotEmpty({ message: "SERVICE_PORT is required" })
  @IsNumber(
    { allowNaN: false, allowInfinity: false },
    { message: "SERVICE_PORT value must be a number" },
  )
  @Min(1000, { message: "Minimal SERVICE_PORT value is 1000" })
  @Max(65535, { message: "Maximal SERVICE_PORT value is 65535" })
  readonly SERVICE_PORT: number;

  @IsNotEmpty({ message: "DATABASE_URL is required" })
  @IsString({ message: "DATABASE_URL must be a string" })
  readonly DATABASE_URL: string;

  @IsNotEmpty({ message: "DATABASE_USER is required" })
  @IsString({ message: "DATABASE_USER must be a string" })
  @MinLength(4, { message: "DATABASE_USER must be at least 4 characters long" })
  readonly DATABASE_USER: string;

  @IsNotEmpty({ message: "DATABASE_PASSWORD is required" })
  @IsString({ message: "DATABASE_PASSWORD must be a string" })
  @MinLength(4, { message: "DATABASE_PASSWORD must be at least 4 characters long" })
  readonly DATABASE_PASSWORD: string;

  @IsNotEmpty({ message: "DATABASE_NAME is required" })
  @IsString({ message: "DATABASE_NAME must be a string" })
  @MinLength(2, { message: "DATABASE_PASSWORD must be at least 2 characters long" })
  readonly DATABASE_NAME: string;

  @IsNotEmpty({ message: "POSTGRES_PORT is required" })
  @IsNumber(
    { allowNaN: false, allowInfinity: false },
    { message: "POSTGRES_PORT value must be a number" },
  )
  @Min(1000, { message: "Minimal DATABASE_PORT value is 1000" })
  @Max(65535, { message: "Maximal DATABASE_PORT value is 65535" })
  readonly DATABASE_PORT: number;

  @IsNotEmpty({ message: "REDIS_HOST is required" })
  @IsString({ message: "REDIS_HOST must be a string" })
  readonly REDIS_HOST: string;

  @IsNotEmpty({ message: "REDIS_PASSWORD is required" })
  @IsString({ message: "REDIS_PASSWORD must be a string" })
  @MinLength(4, { message: "REDIS_PASSWORD must be at least 4 characters long" })
  readonly REDIS_PASSWORD: string;

  @IsNotEmpty({ message: "REDIS_USER is required" })
  @IsString({ message: "REDIS_USER must be a string" })
  @MinLength(4, { message: "REDIS_USER must be at least 4 characters long" })
  readonly REDIS_USER: string;

  @IsNotEmpty({ message: "REDIS_PORT is required" })
  @IsNumber(
    { allowNaN: false, allowInfinity: false },
    { message: "REDIS_PORT value must be a number" },
  )
  @Min(1000, { message: "Minimal REDIS_PORT value is 1000" })
  @Max(65535, { message: "Maximal REDIS_PORT value is 65535" })
  readonly REDIS_PORT: number;

  @IsNotEmpty({ message: "REDIS_TTL is required" })
  @IsNumber(
    { allowNaN: false, allowInfinity: false },
    { message: "REDIS_TTL value must be a number" },
  )
  @Min(1, { message: "Minimal REDIS_TTL value is 1" })
  readonly REDIS_TTL: number;

  @IsNotEmpty({ message: "FILE_MAX_SIZE is required" })
  @IsNumber(
    { allowNaN: false, allowInfinity: false },
    { message: "FILE_MAX_SIZE value must be a number" },
  )
  @Min(1, { message: "Minimal FILE_MAX_SIZE value is 1 MB" })
  readonly FILE_MAX_SIZE: number;

  @IsNotEmpty({ message: "FILE_TYPES is required" })
  @IsString({ message: "FILE_TYPES must be a string" })
  readonly FILE_TYPES: string;
}

export function validate(config: Record<string, unknown>) {
  const validatedConfig = plainToInstance(EnvironmentVariables, config, {
    enableImplicitConversion: true,
  });
  const errors = validateSync(validatedConfig, { skipMissingProperties: false });

  if (errors.length > 0) {
    throw new Error(errors.toString());
  }
  return validatedConfig;
}

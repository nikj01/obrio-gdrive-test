import { IsNotEmpty, IsNumber, IsString, Max, Min, validateSync } from "class-validator";
import { plainToInstance } from "class-transformer";

export class EnvironmentVariables {
  @IsNumber(
    { allowNaN: false, allowInfinity: false },
    { message: "SERVICE_PORT value must be a number" },
  )
  @Min(1000, { message: "Minimal SERVICE_PORT value is 1000" })
  @Max(65535, { message: "Maximal SERVICE_PORT value is 65535" })
  @IsNotEmpty({ message: "SERVICE_PORT is required" })
  readonly SERVICE_PORT: number;

  @IsString({ message: "POSTGRES_URL must be a string" })
  @IsNotEmpty({ message: "POSTGRES_URL is required" })
  readonly POSTGRES_URL: string;

  @IsString({ message: "POSTGRES_USER must be a string" })
  @IsNotEmpty({ message: "POSTGRES_USER is required" })
  readonly POSTGRES_USER: string;

  @IsString({ message: "POSTGRES_PASSWORD must be a string" })
  @IsNotEmpty({ message: "POSTGRES_PASSWORD is required" })
  readonly POSTGRES_PASSWORD: string;

  @IsString({ message: "POSTGRES_DB must be a string" })
  @IsNotEmpty({ message: "POSTGRES_DB is required" })
  readonly POSTGRES_DB: string;

  @IsNumber(
    { allowNaN: false, allowInfinity: false },
    { message: "POSTGRES_PORT value must be a number" },
  )
  @Min(1000, { message: "Minimal POSTGRES_PORT value is 1000" })
  @Max(65535, { message: "Maximal POSTGRES_PORT value is 65535" })
  @IsNotEmpty({ message: "POSTGRES_PORT is required" })
  readonly POSTGRES_PORT: number;

  @IsString({ message: "REDIS_HOST must be a string" })
  @IsNotEmpty({ message: "REDIS_HOST is required" })
  readonly REDIS_HOST: string;

  @IsString({ message: "REDIS_PASSWORD must be a string" })
  @IsNotEmpty({ message: "REDIS_PASSWORD is required" })
  readonly REDIS_PASSWORD: string;

  @IsString({ message: "REDIS_USER must be a string" })
  @IsNotEmpty({ message: "REDIS_USER is required" })
  readonly REDIS_USER: string;

  @IsNumber(
    { allowNaN: false, allowInfinity: false },
    { message: "REDIS_PORT value must be a number" },
  )
  @Min(1000, { message: "Minimal REDIS_PORT value is 1000" })
  @Max(65535, { message: "Maximal REDIS_PORT value is 65535" })
  @IsNotEmpty({ message: "REDIS_PORT is required" })
  readonly REDIS_PORT: number;

  @IsNumber(
    { allowNaN: false, allowInfinity: false },
    { message: "CACHE_TTL value must be a number" },
  )
  @Min(1, { message: "Minimal CACHE_TTL value is 1" })
  @Max(65535, { message: "Maximal CACHE_TTL value is 65535" })
  @IsNotEmpty({ message: "CACHE_TTL is required" })
  readonly CACHE_TTL: number;

  @IsNumber(
    { allowNaN: false, allowInfinity: false },
    { message: "FILE_MAX_SIZE value must be a number" },
  )
  @Min(1, { message: "Minimal FILE_MAX_SIZE value is 1 MB" })
  @IsNotEmpty({ message: "FILE_MAX_SIZE is required" })
  readonly FILE_MAX_SIZE: number;

  @IsString({ message: "FILE_TYPES must be a string" })
  @IsNotEmpty({ message: "FILE_TYPES is required" })
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

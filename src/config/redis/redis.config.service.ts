import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";

@Injectable()
export class RedisConfigService {
  constructor(private readonly configService: ConfigService) {}

  get getHost(): string {
    return this.configService.get<string>("REDIS_HOST", { infer: true })!;
  }

  get getPort(): number {
    return +this.configService.get<number>("REDIS_PORT", { infer: true });
  }

  get getCacheTTL(): number {
    return +this.configService.get<number>("CACHE_TTL", { infer: true }) * 1000;
  }

  get getTTLWithJitter(): number {
    const baseTTL = +this.getCacheTTL;
    return baseTTL + Math.floor(Math.random() * 1000);
  }
}

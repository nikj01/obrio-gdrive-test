import { Module } from "@nestjs/common";
import { CacheModule as Cache } from "@nestjs/cache-manager";
import { RedisConfigModule } from "@app/config/redis/redis.config.module";
import { getCacheConfig } from "./cache.module.config";

@Module({
  imports: [RedisConfigModule, Cache.registerAsync(getCacheConfig())],
  exports: [Cache],
})
export class CacheModule {}

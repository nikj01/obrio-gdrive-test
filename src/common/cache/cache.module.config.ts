import { redisStore } from "cache-manager-redis-yet";
import { RedisConfigService } from "@app/config/redis/redis.config.service";
import { RedisConfigModule } from "@app/config/redis/redis.config.module";
import { CacheModuleAsyncOptions } from "@nestjs/cache-manager";
import { Logger } from "@nestjs/common";

export const getCacheConfig = (): CacheModuleAsyncOptions => {
  const logger = new Logger("CacheConfig");

  return {
    useFactory: async (redisConfigService: RedisConfigService) => {
      const host = redisConfigService.getHost;
      const port = redisConfigService.getPort;
      const ttl = redisConfigService.getCacheTTL;

      const config = {
        socket: { host, port },
        ttl,
      };
      logger.log(`Cache connection config → ${JSON.stringify(config)}`);

      const store = await redisStore(config);

      return {
        store,
      };
    },
    isGlobal: true,
    inject: [RedisConfigService],
    imports: [RedisConfigModule],
  };
};

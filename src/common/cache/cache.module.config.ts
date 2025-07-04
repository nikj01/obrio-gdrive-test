import { redisStore } from "cache-manager-redis-yet";
import { RedisConfigService } from "@app/config/redis/redis.config.service";
import { ConfigModule, ConfigService } from "@nestjs/config";

export const getCacheConfig = () => {
  return {
    useFactory: async (redisConfigService: RedisConfigService) => ({
      store: await redisStore({
        socket: {
          host: redisConfigService.getHost,
          port: redisConfigService.getPort,
        },
        ttl: redisConfigService.getCacheTTL,
      }),
    }),
    isGlobal: true,
    inject: [ConfigService],
    imports: [ConfigModule],
  };
};

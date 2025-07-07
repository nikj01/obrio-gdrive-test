import { RedisConfigService } from "@app/config/redis/redis.config.service";
import Redis from "ioredis";
import Redlock from "redlock";
import { RedisConfigModule } from "@app/config/redis/redis.config.module";

export const REDLOCK = "REDLOCK";

export const getRedlockConfig = () => ({
  useFactory: async (redisConfigService: RedisConfigService) => {
    const client = new Redis({
      host: redisConfigService.getHost,
      port: redisConfigService.getPort,
    });

    await client.ping();

    return new Redlock([client], {
      retryCount: 20,
      retryDelay: 150,
      retryJitter: 50,
      driftFactor: 0.01,
    });
  },
  inject: [RedisConfigService],
  import: [RedisConfigModule],
});

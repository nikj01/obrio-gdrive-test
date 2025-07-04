import { ConfigModule, ConfigService } from "@nestjs/config";
import { SharedBullAsyncConfiguration } from "@nestjs/bullmq";
import { RedisConfigService } from "@app/config/redis/redis.config.service";

export const getBullMQConfig = (): SharedBullAsyncConfiguration => {
  return {
    useFactory: async (redisConfigService: RedisConfigService) => {
      await Promise.resolve();
      return {
        connection: {
          host: redisConfigService.getHost,
          port: redisConfigService.getPort,
        },
      };
    },
    inject: [ConfigService],
    imports: [ConfigModule],
  };
};

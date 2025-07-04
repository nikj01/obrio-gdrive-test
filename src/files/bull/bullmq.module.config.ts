import { RegisterQueueAsyncOptions, SharedBullAsyncConfiguration } from "@nestjs/bullmq";
import { UPLOAD_FILES_PRODUCER, UPLOAD_FILES_QUEUE } from "./constants";
import { RegisterFlowProducerAsyncOptions } from "@nestjs/bullmq/dist/interfaces";
import { Logger } from "@nestjs/common";
import { RedisConfigService } from "@app/config/redis/redis.config.service";
import { RedisConfigModule } from "@app/config/redis/redis.config.module";

export const getBullMQConfig = (): SharedBullAsyncConfiguration => {
  const logger = new Logger("BullMqConfig");

  return {
    useFactory: (redisConfigService: RedisConfigService) => {
      const host = redisConfigService.getHost;
      const port = redisConfigService.getPort;
      const config = { connection: { host, port } };
      logger.log(`BullMQ connection config → ${JSON.stringify(config)}`);
      return config;
    },
    inject: [RedisConfigService],
    imports: [RedisConfigModule],
  };
};

export const getQueueConfig = (): RegisterQueueAsyncOptions => {
  const logger = new Logger("BullMqQueueConfig");

  return {
    name: UPLOAD_FILES_QUEUE,
    useFactory: (redisConfigService: RedisConfigService) => {
      const host = redisConfigService.getHost;
      const port = redisConfigService.getPort;

      const config = { connection: { host, port } };
      logger.log(`BullMqQueue connection config → ${JSON.stringify(config)}`);
      return config;
    },
    inject: [RedisConfigService],
    imports: [RedisConfigModule],
  };
};

export const getProducerConfig = (): RegisterFlowProducerAsyncOptions => {
  const logger = new Logger("BullMqProducerConfig");

  return {
    name: UPLOAD_FILES_PRODUCER,
    useFactory: (redisConfigService: RedisConfigService) => {
      const host = redisConfigService.getHost;
      const port = redisConfigService.getPort;

      const config = { connection: { host, port } };
      logger.log(
        `🔍 Final BullMQProducerConfig connection config → ${JSON.stringify(config)}`,
      );
      return config;
    },
    inject: [RedisConfigService],
    imports: [RedisConfigModule],
  };
};

import { BullModule } from "@nestjs/bullmq";
import { Module } from "@nestjs/common";
import { getBullMQConfig } from "./bullmq.module.config";
import { RedisConfigModule } from "@app/config/redis/redis.config.module";

@Module({
  imports: [RedisConfigModule, BullModule.forRootAsync(getBullMQConfig())],
  exports: [BullModule],
})
export class BullMqModule {}

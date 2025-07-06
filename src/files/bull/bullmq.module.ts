import { BullModule } from "@nestjs/bullmq";
import { Module } from "@nestjs/common";
import {
  getBullMQConfig,
  getProducerConfig,
  getQueueConfig,
} from "./bullmq.module.config";

@Module({
  imports: [
    BullModule.forRootAsync(getBullMQConfig()),
    BullModule.registerQueueAsync(getQueueConfig()),
    BullModule.registerFlowProducerAsync(getProducerConfig()),
  ],
  exports: [BullModule],
})
export class BullMqModule {}

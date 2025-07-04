import { Module } from "@nestjs/common";
import { BullMqModule } from "../files/bull/bullmq.module";
import { JobsRepository } from "./jobs.repository";
import { PrismaModule } from "../common/prisma/prisma.module";

@Module({
  imports: [BullMqModule, PrismaModule],
  providers: [JobsRepository],
  exports: [JobsRepository],
})
export class JobsModule {}

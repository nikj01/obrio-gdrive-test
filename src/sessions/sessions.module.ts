import { Module } from "@nestjs/common";
import { SessionsRepository } from "./sessions.repository";
import { PrismaModule } from "../common/prisma/prisma.module";

@Module({
  imports: [PrismaModule],
  providers: [SessionsRepository],
  exports: [SessionsRepository],
})
export class SessionsModule {}

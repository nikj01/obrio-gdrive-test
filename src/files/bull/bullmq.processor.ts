import { OnWorkerEvent, WorkerHost } from "@nestjs/bullmq";
import { Logger } from "@nestjs/common";
import { Job } from "bullmq";

export abstract class BullMqProcessor extends WorkerHost {
  protected readonly logger = new Logger(this.constructor.name);

  abstract process(job: Job): Promise<any>;

  @OnWorkerEvent("completed")
  onCompleted(job: Job) {
    const { id, name, queueName, finishedOn } = job;
    const completionTime = finishedOn ? new Date(finishedOn).toISOString() : "";
    this.logger.log(
      `Job with id ${id}, name ${name} completed in queue ${queueName} on ${completionTime}`,
    );
  }

  @OnWorkerEvent("progress")
  onProgress(job: Job) {
    const { id, name, progress } = job;
    this.logger.log(`Job with id ${id}, name ${name} completes ${+progress}%`);
  }

  @OnWorkerEvent("failed")
  onFailed(job: Job) {
    const { id, name, queueName, failedReason } = job;
    this.logger.error(
      `Job with id ${id}, name ${name} failed in queue ${queueName}. Failed reason: ${failedReason}`,
    );
  }

  @OnWorkerEvent("active")
  onActive(job: Job) {
    const { id, name, queueName, timestamp } = job;
    const startTime = timestamp ? new Date(timestamp).toISOString() : "";
    this.logger.log(
      `Job with id ${id}, name ${name} starts in queue ${queueName} on ${startTime}.`,
    );
  }
}
